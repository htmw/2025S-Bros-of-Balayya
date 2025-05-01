// Import necessary libraries
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';
import { Storage } from '@google-cloud/storage';
import { SpeechClient } from '@google-cloud/speech';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import natural from 'natural'; 
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import compromise from 'compromise'; 


initializeApp();
const db = getFirestore();

const storage = new Storage();
const speechClient = new SpeechClient();

const bucketName = 'quickrecap-41cb9.firebasestorage.app';


ffmpeg.setFfmpegPath(ffmpegPath);

// Function to process the uploaded video file
export const onFileUploaded = functions.firestore
  .document('users/{userId}')
  .onUpdate(async (change, context) => {
    const after = change.after.data();
    const before = change.before.data();
    const fileUrl = after?.fileUrl; 

    if (after.transcript && after.summary) {
        console.log('Transcript already exists, skipping processing.');
        return null;
      }

    if (fileUrl) {
      const userId = context.params.userId;
      console.log('File URL detected, starting processing...');
      return processVideo(userId, fileUrl);
    } else {
      console.log('No file URL detected. Skipping processing.');
      return null;
    }
  });

// Function to process the video file (download, transcribe, summarize)
async function processVideo(userId, fileUrl) {
  try {
    const decodedUrl = decodeURIComponent(fileUrl);
    const fileName = decodedUrl.split('/').pop().split('?')[0];
    const filePath = `uploads/${userId}/${fileName}`;
    const tempFilePath = path.join(os.tmpdir(), fileName);

    console.log(`Downloading video from: ${filePath}`);
    const file = storage.bucket(bucketName).file(filePath);
    await file.download({ destination: tempFilePath });

    const audioFilePath = path.join(os.tmpdir(), `${userId}_audio.wav`);
    await new Promise((resolve, reject) => {
      ffmpeg(tempFilePath)
        .audioCodec('pcm_s16le')
        .audioChannels(1)
        .audioFrequency(44100)
        .toFormat('wav')
        .on('end', resolve)
        .on('error', reject)
        .save(audioFilePath);
    });

    const audioBlob = storage.bucket(bucketName).file(`audio/${userId}/audio.wav`);
    await audioBlob.save(fs.readFileSync(audioFilePath));

    const gcsUri = `gs://${bucketName}/audio/${userId}/audio.wav`;
    const request = {
      audio: { uri: gcsUri },
      config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 44100,
        languageCode: 'en-US',
        enableAutomaticPunctuation: true,
      },
    };

    const [operation] = await speechClient.longRunningRecognize(request);
    const [response] = await operation.promise();

    let transcript = '';
    response.results.forEach(result => {
      transcript += result.alternatives[0].transcript + ' ';
    });
    console.log(`Transcript: ${transcript}`);

    

    // Sentence segmentation
    function segmentSentences(text) {
      const doc = compromise(text);
      return doc.sentences().out('array');
    }

    const sentences = segmentSentences(transcript);

    // Summarization
    function summarizeText(text, maxSentences = 3) {
      const tokenizer = new natural.WordTokenizer();
      const words = tokenizer.tokenize(text.toLowerCase());
      const wordFreq = {};
      words.forEach(word => {
        if (!natural.stopwords.includes(word)) {
          wordFreq[word] = (wordFreq[word] || 0) + 1;
        }
      });

      const scored = sentences.map(sentence => {
        const words = tokenizer.tokenize(sentence.toLowerCase());
        let score = 0;
        words.forEach(word => { score += wordFreq[word] || 0; });
        return { sentence, score };
      });

      return scored
        .sort((a, b) => b.score - a.score)
        .slice(0, maxSentences)
        .map(s => s.sentence)
        .join(' ');
    }

    // Role-based summary
    const roles = {
      student: {
        keywords: ['education', 'learn', 'lesson', 'life', 'study', 'university', 'college'],
        length: 3,
      },
      entrepreneur: {
        keywords: ['business', 'startup', 'innovation', 'risk', 'vision', 'failure', 'success'],
        length: 3,
      },
      teacher: {
        keywords: ['message', 'structure', 'clarity', 'lesson', 'teaching', 'explain', 'example'],
        length: 4,
      },
      content_creator: {
        keywords: ['quote', 'viral', 'story', 'attention', 'audience', 'engagement', 'hook'],
        length: 2,
      },
    };

    function personalizedSummary(role, sentences) {
      const { keywords, length } = roles[role];
      const filtered = sentences.filter(sentence =>
        keywords.some(keyword => sentence.toLowerCase().includes(keyword))
      );
      const target = filtered.length ? filtered : sentences;
      return summarizeText(target.join(' '), length);
    }

    
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();
    const role = userData ? userData.role : 'student';

    const roleSummary = personalizedSummary(role, sentences);

    
    const userRef = db.collection('users').doc(userId);
    await userRef.set({
      transcript,
      genericSummary: summarizeText(transcript, 3), 
      personalizedSummary: roleSummary, 
    }, { merge: true });

    console.log('Saved transcript and summaries to Firestore!');
  } catch (err) {
    console.error('Error processing video:', err);
  }
}
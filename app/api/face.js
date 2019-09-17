import * as faceapi from 'face-api.js';

// Load models and weights
export async function loadModels() {
  const MODEL_URL = '/models';
  await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
  await faceapi.loadFaceLandmarkTinyModel(MODEL_URL);
  await faceapi.loadFaceRecognitionModel(MODEL_URL);
  console.log('success');
}

export async function getFullFaceDescription(blob, inputSize = 512) {
  // tiny_face_detector options
  const scoreThreshold = 0.5;
  const OPTION = new faceapi.TinyFaceDetectorOptions({
    inputSize,
    scoreThreshold,
  });
  const useTinyModel = true;

  // fetch image to api
  const img = await faceapi.fetchImage(blob);

  // detect all faces and generate full description from image
  // including landmark and descriptor of each face
  const fullDesc = await faceapi
    .detectAllFaces(img, OPTION)
    .withFaceLandmarks(useTinyModel)
    .withFaceDescriptors();
  return fullDesc;
}

const maxDescriptorDistance = 0.5;
export async function createMatcher(faceProfile) {
  console.log('faceProfile', faceProfile);
  // Create labeled descriptors of member from profile
  const members = Object.keys(faceProfile);
  // console.log('members', members);
  const labeledDescriptors = members.map(
    member =>
      new faceapi.LabeledFaceDescriptors(
        faceProfile[member].name,
        faceProfile[member].descriptors.map(
          descriptor => new Float32Array(descriptor),
        ),
      ),
  );

  // Create face matcher (maximum descriptor distance is 0.5)
  const faceMatcher = new faceapi.FaceMatcher(
    labeledDescriptors,
    maxDescriptorDistance,
  );
  return faceMatcher;
}

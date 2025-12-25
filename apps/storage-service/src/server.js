require('dotenv').config();
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const minioClient = require('../../../libs/common/minioClient');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const PROTO_PATH = path.join(__dirname, '../../../libs/common/upload.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const uploadProto = grpc.loadPackageDefinition(packageDefinition).storage;

// Optional file validation
function validateFile(fileName, fileData) {
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (!fileName) throw new Error('File must have a name');
  if (!fileData || fileData.length === 0) throw new Error('File is empty');
  if (fileData.length > maxSize) throw new Error('File too large');
}

// gRPC UploadFile method
async function UploadFile(call, callback) {
  try {
    console.log('--- UploadFile called ---');
    console.log('Received fileName:', call.request.fileName);
    console.log('Received fileData length:', call.request.fileData?.length);

    // ✅ Check MinIO connection first
    minioClient.listBuckets((err, buckets) => {
      if (err) {
        console.error('MinIO connection failed:', err);
      } else {
        console.log('Connected to MinIO. Buckets:', buckets.map(b => b.name));
      }
    });

    validateFile(call.request.fileName, call.request.fileData);
  

    const fileName = `${uuidv4()}-${call.request.fileName}`;
    const bucketName = 'user-profile-pictures';

    // Ensure bucket exists
    const exists = await minioClient.bucketExists(bucketName);
    console.log('Bucket exists?', exists);
    if (!exists) {
      console.log('Creating bucket:', bucketName);
      await minioClient.makeBucket(bucketName);
    }

    // Upload file
    // console.log('Uploading file to MinIO...');
    // await minioClient.putObject(bucketName, fileName, call.request.fileData);
    // console.log('File uploaded:', fileName);
    // const fileUrl = `http://${process.env.MINIO_HOST}:${process.env.MINIO_PORT || 9000}/${bucketName}/${fileName}`;


    console.log("New...")
    console.log('Uploading file to MinIO...');
await minioClient.putObject(
  bucketName,
  fileName,
  call.request.fileData
);
console.log('File uploaded:', fileName);

// Generate presigned URL (valid for 1 hour)
const expirySeconds = 60 * 60;

const fileUrl = await minioClient.presignedGetObject(
  bucketName,
  fileName,
  expirySeconds
);

console.log('Presigned URL:', fileUrl);




    callback(null, { fileUrl });

  } catch (err) {
    console.error('UploadFile error:', err);
    callback({
      code: grpc.status.INTERNAL,
      message: err.message,
    });
  }
}

// Start gRPC server
function main() {
  const server = new grpc.Server();
  server.addService(uploadProto.UploadService.service, { UploadFile });
  const port = '0.0.0.0:50051';
  server.bindAsync(port, grpc.ServerCredentials.createInsecure(), () => {
    console.log(`Storage gRPC server running at ${port}`);
    server.start();
  });
}

main();

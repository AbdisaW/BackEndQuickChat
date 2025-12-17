const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join('/app/libs/common/upload.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const uploadProto = grpc.loadPackageDefinition(packageDefinition).storage;

// Use Docker Compose service name for network access
const client = new uploadProto.UploadService(
  `${process.env.STORAGE_HOST || 'storage-service'}:50051`,
  grpc.credentials.createInsecure()
);

// Wrap gRPC call in a promise
function uploadFile(fileName, fileBuffer) {
  return new Promise((resolve, reject) => {
    client.UploadFile({ fileName, fileData: fileBuffer }, (err, response) => {
      if (err) return reject(err);
      resolve(response.fileUrl);
    });
  });
}

module.exports = { client, uploadFile };

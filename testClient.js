  const grpc = require('@grpc/grpc-js');
  const protoLoader = require('@grpc/proto-loader');
  const fs = require('fs');
  const path = require('path');

  const PROTO_PATH = path.join(__dirname, 'libs/common/upload.proto');

  const packageDefinition = protoLoader.loadSync(PROTO_PATH);
  const uploadProto = grpc.loadPackageDefinition(packageDefinition).storage;

  const client = new uploadProto.UploadService(
    'localhost:50051',
    grpc.credentials.createInsecure()
  );

  // test.jpg should exist at project root
  const filePath = path.join(__dirname, 'test.jpg');
  const fileData = fs.readFileSync(filePath);

  client.UploadFile({ fileName: 'test.jpg', fileData }, (err, response) => {
    if (err) console.error('Upload failed:', err);
    else console.log('File uploaded successfully! URL:', response.fileUrl);
  });

#!/bin/bash


# Create directories for the generated code
mkdir -p generated

# Generate JS files from proto
protoc \
  --js_out=import_style=commonjs,binary:./generated \
  --grpc-web_out=import_style=typescript,mode=grpcwebtext:./generated \
  ./proto/appointment.proto
  
echo "Proto files generated successfully!"

if [ $? -eq 0 ]; then
  echo "Proto generation completed successfully!"
  echo "Generated files in ${OUTPUT_DIR} and ${WEB_DIR}"
else
  echo "Proto generation failed!"
fi
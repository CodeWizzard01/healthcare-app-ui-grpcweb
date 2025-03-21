#!/bin/bash

PROJECT_ROOT=$(cd "$(dirname "$0")/.." && pwd)
PROTO_DIR="${PROJECT_ROOT}/proto"
OUTPUT_DIR="${PROJECT_ROOT}/src/generated"
WEB_DIR="${PROJECT_ROOT}/src/generated/web"

echo "Using project root: ${PROJECT_ROOT}"
echo "Proto directory: ${PROTO_DIR}"
echo "Output directory: ${OUTPUT_DIR}"

# Create output directories if they don't exist
mkdir -p $OUTPUT_DIR
mkdir -p $WEB_DIR

# First install the required packages locally if not present
if [ ! -d "${PROJECT_ROOT}/node_modules/google-protobuf" ]; then
  echo "Installing required packages..."
  npm install --save-dev google-protobuf grpc-web
fi

# For local installation, use the node_modules bin path
JS_PLUGIN="${PROJECT_ROOT}/node_modules/.bin/protoc-gen-js"
GRPC_WEB_PLUGIN="${PROJECT_ROOT}/node_modules/.bin/protoc-gen-grpc-web" 

# Install protoc-gen-js and protoc-gen-grpc-web if not found
if [ ! -f "$JS_PLUGIN" ]; then
  echo "Installing protoc-gen-js..."
  npm install --save-dev protoc-gen-js
fi

if [ ! -f "$GRPC_WEB_PLUGIN" ]; then
  echo "Installing protoc-gen-grpc-web..."
  npm install --save-dev protoc-gen-grpc-web
fi

echo "Using protoc plugins:"
echo "JS Plugin: $JS_PLUGIN"
echo "gRPC Web Plugin: $GRPC_WEB_PLUGIN"



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
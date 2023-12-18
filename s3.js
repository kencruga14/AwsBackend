import { S3Client, PutObjectCommand, ListObjectsCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import fs from 'fs'
import {getSignedUrl} from '@aws-sdk/s3-request-presigner'
const BUCKET_NAME = 'awsunibe'
const BUCKET_REGION ='us-east-2'
const PUBLIC_KEY = '****'
const SECRET_KEY = '***'


const client = new S3Client({
    region: BUCKET_REGION,
    credentials: {
        accessKeyId: PUBLIC_KEY,
        secretAccessKey: SECRET_KEY
    }
})

export async function uploadFile(file) {
    const stream = fs.createReadStream(file.tempFilePath)
    const uploadParams = {
        Bucket: BUCKET_NAME,
        Key: file.name,
        Body: stream
    }
    const command = new PutObjectCommand(uploadParams)
    return await client.send(command)
}

export async function getFiles() {
    const command = new ListObjectsCommand({
        Bucket: BUCKET_NAME
    })
    return await client.send(command)
}

export async function getFile(filename) {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: filename
    })
    return await client.send(command)
}

export async function downloadFile(filename) {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: filename
    })
    const result = await client.send(command)
    return result.Body
}

export async function getFileURL(filename) {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: filename
    })
    return await getSignedUrl(client, command, { expiresIn: 3600 })
}

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { env } from "./config";
import { Steps } from "openai/resources/beta/threads/runs/steps";
import { fileFromPath } from "openai";
import { it } from "node:test";

// Preprocess the PDF into chunks Before storing them in Pinecone db
// * Instantiate PDFLoader with path of the pdf and load it to docs
// * Instantiate the RecurvieCharacterText splitter
// * Split the document, then return it

export async function getChunkedDocsFromPDF() {
  try {
    const loader = new PDFLoader(env.PDF_PATH);
    const docs = await loader.load();
    console.log("docs at lib/pdf-loader: ", docs)

    // From the docs https://www.pinecone.io/learn/chunking-strategies/
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunkedDocs = await textSplitter.splitDocuments(docs);

    return chunkedDocs;

  } catch (e) {
    console.error(e);
    throw new Error("PDF docs chunking failed !");
  }
}

from fastapi import FastAPI, UploadFile, File
from drawio import DrawIoXMLReader
from fastapi.middleware.cors import CORSMiddleware
from mapper import EpcToBpmnMapper
from fastapi.responses import JSONResponse

app = FastAPI()


app.add_middleware(
   CORSMiddleware,
    allow_origins = ['http://127.0.0.1:5500', "http://localhost:3000", 'http://localhost:5500' ],
    allow_credentials =True,
    allow_methods = ["*"],
    allow_headers= ["*"],   
)

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/upload-file/")
async def upload_file(file: UploadFile = File(...)):
    # Save the file to disk or perform any desired operations
    # For example, you can save the file using the filename attribute of the UploadFile object:
    file_path = f"uploads/{file.filename}"
    print(file_path)
    drawIoXmlReader = DrawIoXMLReader(file_path)

    shape = drawIoXmlReader.getShapes()

    bpmn_representation = EpcToBpmnMapper().mapper(shape)
    print(bpmn_representation)
    return JSONResponse(content=bpmn_representation, status_code=200)

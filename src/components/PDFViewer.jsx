import React from "react"


export class PDFViewer extends React.Component {
  render(){
    const { fileId } = this.props
    const src = "http://localhost:3030/pdfviewer/viewer.html?file=/api/file/" + fileId + "/pdf"
    return (
      <div style={{width: '100%', height: 600, position: 'relative'}}>
        <iframe className="pb-fullscreen-iframe" name="pdf-frame" src={src} width="100%" height="100%" ></iframe>
      </div>
    )
  }
}
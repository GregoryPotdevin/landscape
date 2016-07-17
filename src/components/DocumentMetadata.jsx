import React from "react"
import { Icon } from './Icon'

const API = 'http://localhost:3030'

const fakeData = {
  "SourceFile": "files/156/file.pdf",
  "Creator": "callas software gmbh, PDFEngine V. 2.0.001",
  "CreateDate": "2012:03:30 19:04:59+03:00",
  "ModifyDate": "2012:04:02 12:56:10+03:00",
  "PageCount": 410,
  "FileName": "file.pdf",
  "FileType": "PDF",
  "MIMEType": "application/pdf",
  "Format": "application/pdf"
}

const ButtonGroup = ({style, children}) => (
  <div style={style}>{children}</div>
)

const Button = ({children, ...props}) => (
  <a className="button-secondary pure-button" {...props}>{children}</a>
)

export class DocumentMetadata extends React.Component {
  
  constructor(){
    super()
    
    this.renderLine = this.renderLine.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
    this.state = {
      tab: 1
    }
  }
  
  handleSelect(tab) {
    event.preventDefault();
    this.setState({
      tab
    })
  }

  render() {
    const { tab } = this.state
    const { FileType } = this.props
    const id = this.props.id
    var date = this.props.ModifyDate || this.props.CreateDate
    if (date) date = date.substring(0, 10)
        // <ButtonGroup style={{float: 'right'}}>
        //   <Button><Icon name="share-alt" /> Partager</Button>
        //   <Button  href={API + "/api/file/" + id + "/download"} target="__blank"><Icon name="download" /> Télécharger</Button>
        //   {FileType != "PDF" ? <Button  href={API + "/api/file/" + id + "/pdf"} target="__blank"><Icon name="file-pdf-o"/> PDF</Button> : undefined}
        // </ButtonGroup>
        // <h3>{this.props.FileName}</h3>
    return (
      <div>
   {/*     <Nav bsStyle="tabs" activeKey={tab} onSelect={this.handleSelect}>
         <NavItem eventKey={1}>Metadonnées</NavItem>
          <NavItem eventKey={2}>Versions</NavItem>
        </Nav>*/}
        <table className="pure-table pure-table-striped" style={{marginTop: 8}}>
          <tbody>
            {this.renderLine("Titre", "Title")}
            {this.renderLine("Fichier", "Filename")}
            {this.renderLine("Type de fichier", "FileType")}
            {this.renderLine("Nombre de pages", "PageCount")}
            {this.renderLine("Auteur", "Author")}
            {this.renderLine("Créateur", "Creator")}
            {this.renderLine("Date de création", "CreateDate")}
            {this.renderLine("Date de modif.", "ModifyDate")}
            {this.renderLine("Abstract", "Abstract")}
          </tbody>
        </table>
      </div>
    )
  }
  
  renderLine(label, key){
    return (
      <tr>
        <td style={{width: 120, fontWeight: "500"}}>{label}</td>
        <td>{this.props[key]}</td>
      </tr>
    )
  }
};

class DocumentPage extends React.Component {
  
  constructor(props){
    console.log("Build DocumentPage")
    super(props)
    this.alive = true
    this.state = {
      data: null
    }
  }
  
  componentWillMount(){
    const id = this.props.docId
    console.log("fetch", id)
    fetch("http://localhost:9200/plf/files/" + id)
      .then(res => res.json())
      .then(data => {
        if (this.alive) {
          this.setState({ data })
        }
      })
  }
  
  componentWillUnmount(){
    this.alive = false
  }
  
  render(){
    console.log("render");
    // return <div>Document {this.props.params.docId}</div>
    const id = this.props.docId
    if (!this.state.data) return null;
    const doc = this.state.data._source// DocumentStore[id]
    if (!doc) return <div></div>
    console.log(doc)
    const { Title, Filename } = doc
    const src = "http://localhost:3030/pdfviewer/viewer.html?file=/api/file/" + id + "/pdf"
    return (
      <div style={{position: "relative", width: "100%", top: 0}}>
        <h1 className="title" style={{fontSize: 24}}><Icon icon="file-o"/> {Title || Filename}</h1>
        <div style={{padding: 16, width: '100%', display: 'flex'}}>
          <div style={{width: '50%', height: "100%", flex: "1", position: 'relative'}}>
            <iframe className="fullscreen-iframe" name="pdf-frame" src={src} width="100%" height="100%" ></iframe>
          </div>
          <div style={{width: '50%', flex: "1", padding: 8}}>
            <DocumentMetadata {...doc} id={id}/>
          </div>
        </div>
      </div>
      
    )
  }
  
  renderLine(label, key){
    const id = this.props.params.docId
    const doc = DocumentStore[id]
    return (
      <tr>
        <td style={{width: 120, fontWeight: "500"}}>{label}</td>
        <td>{doc[key]}</td>
      </tr>
    )
  }
}

export class DocumentPageWidget extends React.Component {
  render(){
    const { documentId } = this.props
    return (
      <DocumentPage key={documentId} docId={documentId} />
    )
  }
}
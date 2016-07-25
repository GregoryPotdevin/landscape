import React from "react"
import { App as Search } from '../app-search'
import shallowCompare from 'react-addons-shallow-compare';

import sortBy from 'lodash/sortBy'

export const landscapeKeywords = _.sortBy([
  {value: "open source", label: "Open Source"},
  {value: "software", label: "Software"},
  {value: "ocaml", label: "OCaml"},
  {value: "reactjs", label: "React.js"},
  {value: "nodejs", label: "Node.js"},
  {value: "php", label: "PHP"},
  {value: "sql", label: "SQL"},
  {value: "postgresql", label: "PostgreSQL"},
  {value: "mongodb", label: "MongoDB"},
  {value: "database", label: "Database"},
  {value: "data", label: "Data"},
  {value: "dam", label: "DAM"},
  {value: "mam", label: "MAM"},
  {value: "ada", label: "ADA"},
  {value: "critical software", label: "Critical Software"},
  {value: "web development", label: "Web development"},
  {value: "symfony", label: "Symfony"},
  {value: "project management", label: "Project Management"},
  {value: "low level", label: "Low Level Programming"},
  {value: "mooc", label: "MOOC"},
  {value: "optimization", label: "Optimization"},
  {value: "consulting", label: "Consulting"},
  {value: "business intelligence", label: "Business Intelligence"},
  {value: "web hosting", label: "Web hosting"},
  {value: "training", label: "Training"},
  {value: "devops", label: "DevObs"},
  {value: "big data", label: "Big Data"},
  {value: "security", label: "Security"},
  {value: "server", label: "Server"},
  {value: "data center", label: "Data Center"},
  {value: "hpc", label: "HPC"},
  {value: "cloud", label: "Cloud"},
  {value: "hadoop", label: "Hadoop"},
  {value: "mobile", label: "Mobile"},
  {value: "android", label: "Android"},
  {value: "ios", label: "iOS"},
  {value: "java", label: "Java"},
  {value: "ecommerce", label: "eCommerce"},
  {value: "search", label: "Search"},
  {value: "elasticsearch", label: "ElasticSearch"},
  {value: "opensearchserver", label: "OpenSearchServer"},
], (el) => el.label.toLowerCase())

var defaultList = JSON.parse(localStorage.getItem('companies'))

function getElements(keywords=[]){
  const found = {}
  const elements = []
  keywords.forEach(keyword => {
    defaultList.forEach(el => {
      if (!found[el.id] && el.skills && el.skills.indexOf(keyword) != -1){
        found[el.id] = true
        elements.push(el)
      }
    })
  })
  return sortBy(elements, (el) => el.name.toLowerCase())
}

const Logo = ({src}) => {
  return (
  <div className="fit" style={{
    display: "inline-block" ,
    width: 80, 
    height: 48, 
    verticalAlign: 'middle',
    backgroundImage: `url(${src})`}} />
)}

class LandscapeCompany extends React.Component {
  
  showComponentUpdate(nextProps, nextState){
    return shallowCompare(this, nextProps, nextState)
  }
  
  render(){
    const { name, logo, subtitle, website } = this.props
    
    return (
      <div className="pb-landscape-entry" style={{textAlign: 'center', padding: 8}}>
        <div><Logo src={logo} /></div>
        <div>{name}</div>
        <div className="pb-landscape-popup">
          {subtitle}<br />
          <a href={website} target="__blank">{website}</a>
        </div>
      </div>
    )
  }
}

export class Landscape extends React.Component {
  
  showComponentUpdate(nextProps, nextState){
    return shallowCompare(this, nextProps, nextState)
  }
  
  render(){
    const { label, keywords=[], gridSize=3, backgroundColor } = this.props
    const elements = getElements(keywords)
    return (
      <div style={{padding: 4}}>
        <div className="pb-landscape-panel">
          <h3 style={{textAlign: 'center', color: 'white', backgroundColor}}>{label}</h3>
          <div className="pb-dynamic-list" style={{width: '100%'}}>
            {elements.map((el, i) => (
              <div key={i} style={{width: 100/gridSize + '%', display: 'inline-block', verticalAlign: 'top'}}>
                <LandscapeCompany {...el} />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}


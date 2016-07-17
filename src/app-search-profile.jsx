import * as React from "react";
import * as _ from "lodash";

import {
	SearchkitManager, SearchkitProvider,
	SearchBox, RefinementListFilter, MenuFilter,
	Hits, HitsStats, NoHits, Pagination, SortingSelector,
	GroupedSelectedFilters, ResetFilters, ItemHistogramList,
  ViewSwitcherToggle, ViewSwitcherHits,
	Layout, LayoutBody, LayoutResults, TopBar,
	SideBar, ActionBar, ActionBarRow, Tabs, Panel,
  RangeFilter, NumericRefinementListFilter,
} from "searchkit";


const ProfileHit = (props) =>  {
  const { bemBlocks, result } = props
  const source = result._source;
  let url = "http://localhost:3001/static/images/" + source.avatar;
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item")) } key={result._id}>
      <a href={url} target="_blank">
        <div className={bemBlocks.item("poster") } style={{
          width: 120, height: 180,
          background: 'url(' + url + ')',
          backgroundSize: 'cover',
          backgroundPosition: 'center center'
        }} />
      </a>
      <a href={url} target="_blank">
        <div className={bemBlocks.item("title") } dangerouslySetInnerHTML={{ __html: _.get(result, "highlight.title", false) || source.Prénom }}>
        </div>
      </a>
    </div>
  )
}

function formatHeight(height){
  const h = "" + height;
  return h[0] + 'm' + h[1] + h[2]
}

const ProfileListHit = (props) =>  {
  const { bemBlocks, result } = props
  const source = result._source;
  let url = "http://localhost:3001/static/images/" + source.avatar;
  var images = [];
  for(var i=0; i<7 && i<source.images.length; i++){
    images.push('/static/images/' + source.images[i]);
  }
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item")) } key={result._id} style={{
      width: '99%',
      minWidth: '99%',
      display: 'table-row'
    }}>
      <div style={{marginLeft: 'auto', marginRight: 'auto'}}>
        <div style={{display: "table-cell", height: 200}}>
          <a href={url} target="_blank">
            <div className={bemBlocks.item("poster") } style={{
              width: 180, height: 280,
              background: 'url(' + url + ')',
              backgroundSize: 'cover',
              backgroundPosition: 'center center'
            }} />
          </a>
        </div>
        <div style={{display: "table-cell", verticalAlign: 'top', paddingLeft: 8}}>
          <h2 style={{marginTop: 0, marginBottom: 0}}>{source.Prénom}</h2>
          <div style={{width: '100%'}}>
            {images.map(img => (
              <div style={{
                margin: 2,
                display: 'inline-block',
                width: 54, height: 80,
                background: 'url(http://localhost:3001' + img + ')',
                backgroundSize: 'cover',
                backgroundPosition: 'center center'
              }} />
              ))}
          </div>
          <ul style={{marginTop: 8, marginBottom: 8, listStyleType: 'none', lineHeight: '1.4em', paddingLeft: 4}}>
            <li>Yeux: {source.Yeux}</li>
            <li>Taille: {source.Taille}</li>
            <li>Confection: {source.Confection}</li>
            <li>Hanches: {source.Hanches}</li>
            <li>Hauteur: {formatHeight(source.Hauteur)}</li>
            <li>Chaussures: {source.Chaussures}</li>
            <li>Domaine Artistique: {source['Domaine Artistique'].join(', ')}</li>
          </ul>
        </div>
       </div>
    </div>
  )
}


class ResetFiltersDisplay extends React.Component<any, any> {
    render(){
        const {bemBlock, hasFilters, resetFilters} = this.props
        return (
            <div onClick={resetFilters} className={bemBlock().state({disabled:!hasFilters})}>
                <div className={bemBlock("reset")}>Supprimer les filtres</div>
            </div>
        )
    }
}


function rateSort(buckets){
  var list = buckets.slice()
  var weights={
    pg: 1000,
    'pg-13': 900,
    'pg13': 800,
    '13': 700,
    'r': 10
  }
  list.sort((a, b) => {
    const wa = weights[a.key] || 1
    const wb = weights[b.key] || 1
    if (wa > wb) return -1;
    else if (wa < wb) return 1;
    else return 0;
  })
  return list
}


const HiddeablePanel = ({visible, children, ...props}) => {
  return (
    <div style={{display: visible ? 'initial': 'none'}}>
      <Panel {...props}>{children}</Panel>
    </div>
  )
}

export class App extends React.Component {

 
  constructor() {
    super()
    // const host = "https://d78cfb11f565e845000.qb0x.com/movies"
    const host = "http://localhost:9200/cyriljoubert/profile"
    this.searchkit = new SearchkitManager(host, {
      useHistory: false,
      searchOnLoad: true
    })
    this.searchkit.translateFunction = (key) => {
      return { "pagination.next": "Next Page" }[key]
    }
  }
  
  componentDidMount(){
    console.log("Search time !!!");
    this.searchkit.reloadSearch()
  }

                // queryFields={["actors^1", "type^2", "languages", "title^5", "genres^2"]}/>
  render() {
    const { eyeColor, hairColor, heightFilter, sex } = this.props
    return (
      <div>
      <SearchkitProvider searchkit={this.searchkit}>
      <div>
        <Layout>
          <TopBar>
              <div className="my-logo">Agence Future</div>
              <SearchBox
                translations={{ "searchbox.placeholder": "recherche de profils" }}
                queryOptions={
                  {
                    default_operator: "AND"
                    // "minimum_should_match": "70%"
                  }
                }
                autofocus={true}
                searchOnChange={true}  />
           </TopBar>
          <LayoutBody>

            <SideBar>
              <RefinementListFilter id="yeux" title="Couleur des yeux" field="Yeux.raw" operator="OR" size={10} 
                containerComponent={<HiddeablePanel visible={eyeColor} />} />
              <RefinementListFilter id="cheveux" title="Cheveux" field="Cheveux.raw" operator="OR" size={10}
                containerComponent={<HiddeablePanel visible={hairColor} />} />
              <RangeFilter min={160} max={200} field="Hauteur" id="hauteur" title="Hauteur" showHistogram={true} interval={1}
                containerComponent={<HiddeablePanel visible={heightFilter} />} />
            </SideBar>

            <LayoutResults>
              <ActionBar>

                <ActionBarRow>
                  <HitsStats/>

                  <ViewSwitcherToggle />
                  <SortingSelector options={[
                    { label: "Prénom", field: "Prénom.raw", order: "asc" },
                    { label: "Sexe", field: "Genre.raw", order: "asc" },
                    { label: "Taille", field: "Hauteur", order: "asc" },
                    // { label: "Relevance", field: "_score", order: "desc" },
                    // { label: "Latest Releases", field: "released", order: "desc" },
                    // { label: "Earliest Releases", field: "released", order: "asc" }
                  ]}/>
                  </ActionBarRow>

                <ActionBarRow>
                  <ResetFilters component={ResetFiltersDisplay}/>
                  <GroupedSelectedFilters />
                </ActionBarRow>

                <ActionBarRow>
                  <MenuFilter id="genre" title="Sexe" field="Genre.raw" operator="OR" listComponent={Tabs} 
                    containerComponent={<HiddeablePanel visible={sex} />} />
                </ActionBarRow>
              </ActionBar>
              
              <ViewSwitcherHits 
                hitsPerPage={12}
                hitComponents = {[
                {key:"grid", title:"Grid", itemComponent:ProfileHit},
                {key:"list", title:"List", itemComponent:ProfileListHit}
              ]}
              />
              <NoHits suggestionsField={"Prénom"}/>
              <Pagination showNumbers={true} />
              </LayoutResults>
            </LayoutBody>
          <a className="view-src-link" href="https://github.com/searchkit/searchkit-demo/blob/master/src/app/src/App.tsx">View source »</a>
          </Layout>
        </div>
        </SearchkitProvider>
        </div>
    )
  }

}

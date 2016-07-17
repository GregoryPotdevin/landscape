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
} from "searchkit";

import { GridList, Flag } from './components'

const MovieHitsGridItem = (props)=> {
  const {bemBlocks, result} = props
  let url = "http://www.imdb.com/title/" + result._source.imdbId
  const source:any = _.extend({}, result._source, result.highlight)
  var imgUrl = result._source.poster.replace("https://s3-eu-west-1.amazonaws.com/imdbimages/images/",
    "http://localhost:3030/api/imdb/")
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <a href={url} target="_blank">
        <img data-qa="poster" className={bemBlocks.item("poster")} src={imgUrl} width="85" height="120"/>
        <div data-qa="title" className={bemBlocks.item("title")} dangerouslySetInnerHTML={{__html:source.title}}>
        </div>
      </a>
    </div>
  )
}

const MovieHitsListItem = (props)=> {
  const {bemBlocks, result} = props
  let url = "http://www.imdb.com/title/" + result._source.imdbId
  const source:any = _.extend({}, result._source, result.highlight)
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <div className={bemBlocks.item("poster")}>
        <img data-qa="poster" src={result._source.poster}/>
      </div>
      <div className={bemBlocks.item("details")}>
        <a href={url} target="_blank"><h2 className={bemBlocks.item("title")} dangerouslySetInnerHTML={{__html:source.title}}></h2></a>
        <h3 className={bemBlocks.item("subtitle")}>Released in {source.year}, rated {source.imdbRating}/10</h3>
        <div className={bemBlocks.item("text")} dangerouslySetInnerHTML={{__html:source.plot}}></div>
      </div>
    </div>
  )
}

const HiddeablePanel = ({visible, children, ...props}) => {
  return (
    <div style={{display: visible ? 'initial': 'none'}}>
      <Panel {...props}>{children}</Panel>
    </div>
  )
}

export class App extends React.Component {
  
  constructor(props){
    super(props)
    
    
    const host = "http://localhost:9200/imdb2"
    // const host = "http://demo.searchkit.co/api/movies"
    this.searchkit = new SearchkitManager(host, {
      useHistory: false,
      searchOnLoad: true
    })
  }
  
  componentDidMount(){
    console.log("Search time !!!");
    this.searchkit.reloadSearch()
  }
  
	render(){
    const { actors, countries, writers, types } = this.props
		return (
			<SearchkitProvider searchkit={this.searchkit}>
		    <Layout>
		      <TopBar>
		        <SearchBox
		          autofocus={true}
		          searchOnChange={true}
							placeholder="Search movies..."
		          prefixQueryFields={["actors^1","type^2","languages","title^10"]}/>
		      </TopBar>
		      <LayoutBody>
		        <SideBar>
              <RefinementListFilter id="countries" title="Countries" field="countries.raw" operator="OR" size={9}
                containerComponent={<HiddeablePanel visible={countries} />} 
                listComponent={
                  <GridList columnCount={3} labelComponent={Flag}/>
                }/>
		          <RefinementListFilter id="actors" title="Actors" field="actors.raw" operator="AND" size={10}
                containerComponent={<HiddeablePanel visible={actors} />}/>
		          <RefinementListFilter id="writers" title="Writers" field="writers.raw" operator="OR" size={10}
                containerComponent={<HiddeablePanel visible={writers} />}/>
		        </SideBar>
		        <LayoutResults>
		          <ActionBar>
		            <ActionBarRow>
		              <HitsStats/>
                  <ViewSwitcherToggle/>
									<SortingSelector options={[
										{label:"Relevance", field:"_score", order:"desc", defaultOption:true},
										{label:"Latest Releases", field:"released", order:"desc"},
										{label:"Earliest Releases", field:"released", order:"asc"}
									]}/>
		            </ActionBarRow>
		            <ActionBarRow>
		              <GroupedSelectedFilters/>
		              <ResetFilters/>
		            </ActionBarRow>
							  <ActionBarRow>
                  <MenuFilter id="type" title="Movie Type" field="type.raw" listComponent={Tabs} containerComponent={<HiddeablePanel visible={types} />}/>
                </ActionBarRow>
		          </ActionBar>
              
              <ViewSwitcherHits
                  hitsPerPage={12} highlightFields={["title","plot"]}
                  sourceFilter={["plot", "title", "poster", "imdbId", "imdbRating", "year"]}
                  hitComponents = {[
                    {key:"grid", title:"Grid", itemComponent:MovieHitsGridItem, defaultOption:true},
                    {key:"list", title:"List", itemComponent:MovieHitsListItem}
                  ]}
                  scrollTo="body"
              />
		          <NoHits/>
							<Pagination showNumbers={true}/>
		        </LayoutResults>
		      </LayoutBody>
		    </Layout>
		  </SearchkitProvider>
		)
	}
}

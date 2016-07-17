import { findItems, extractKeys, guessType } from './analyzeJson'

describe("findItems", () => {
  it("should work for array", () => {
    const items = [ {id: 1}, {id: 2}]

    expect(findItems(items)).toEqual(items)
  })
  it("should work for ES", () => {
    const hits = [
      {_id: 1, _source: {}},
      {_id: 2, _source: {}}
    ]
    const esResult = {
      hits: { hits }
    }
    expect(findItems(esResult)).toEqual(hits)
  })
  
  it("should work for flickr", () => {
    expect(findItems(flickrData)).toEqual(flickrData.items)
  })
  
  it("should work for items", () => {
    const items = [ {id: 1}, {id: 2}]
    expect(findItems({ items })).toEqual(items)
  })
})

describe("guessType", () => {
  it("should detect urls", () => {
    expect(guessType("http://www.google.com")).toEqual({type: "url"})
    expect(guessType("https://www.google.com")).toEqual({type: "url"})
    expect(guessType("Not just an url https://www.google.com")).not.toEqual({type: "url"})
    expect(guessType("https://www.google.com is text")).not.toEqual({type: "url"})
  })
  
  it("should detect image urls", () => {
    expect(guessType("http://www.google.com/image.png")).toEqual({type: "image"})
    expect(guessType("http://www.google.com/image.jpg")).toEqual({type: "image"})
    expect(guessType("http://www.google.com/image.jpeg")).toEqual({type: "image"})
    expect(guessType("http://www.google.com/image.gif")).toEqual({type: "image"})
    expect(guessType("/somefolder/image.png")).toEqual({type: "image"})
    expect(guessType("http://www.google.com/image.avi")).not.toEqual({type: "image"})
  })
  
  it("should detect dates", () => {
    expect(guessType("2016-04-28T10:31:02Z")).toEqual({type: "date"})
    expect(guessType("2016/01/01")).toEqual({type: "date"})
    expect(guessType("2015")).not.toEqual({type: "date"})
  })
})

describe("extractKeys", () => {
  it("should work for flickr", () => {
    expect(extractKeys(flickrData.items[0])).toEqual([
      { key: 'title', type: 'string', value: 'Police Paris - Titus BRI PP'},
      { key: 'link', type: 'url', value: 'https://www.flickr.com/photos/117937301@N02/26625631191/' }, 
      { key: 'media.m', type: 'image', value: 'https://farm2.staticflickr.com/1656/26625631191_c91b680b7e_m.jpg' }, 
      { key: 'date_taken', type: 'date', value: '2016-04-27T16:12:54-08:00' }, 
      { key: 'description', type: 'string', value: " <p>avec le RAID et les différents GIPN ultra-marins.<\/p>"}, 
      { key: 'published', type: 'date', value: '2016-04-28T10:31:02Z' },
      { key: 'author', type: 'string', value: 'nobody@flickr.com (Arthur Lombard)' },
      { key: 'author_id', type: 'string', value: '117937301@N02' },
      { key: 'tags', type: 'string', value: 'black paris france nikon 4x4 police policecar bri swat titus lightbar policedepartment blindé nexter bripp nikond7200' }
    ])
  })
})

var flickrData = {
		"title": "Recent Uploads tagged paris",
		"link": "https://www.flickr.com/photos/tags/paris/",
		"description": "",
		"modified": "2016-04-28T10:31:02Z",
		"generator": "https://www.flickr.com/",
		"items": [
	   {
			"title": "Police Paris - Titus BRI PP",
			"link": "https://www.flickr.com/photos/117937301@N02/26625631191/",
			"media": {"m":"https://farm2.staticflickr.com/1656/26625631191_c91b680b7e_m.jpg"},
			"date_taken": "2016-04-27T16:12:54-08:00",
			"description": " <p>avec le RAID et les différents GIPN ultra-marins.<\/p>",
			"published": "2016-04-28T10:31:02Z",
			"author": "nobody@flickr.com (Arthur Lombard)",
			"author_id": "117937301@N02",
			"tags": "black paris france nikon 4x4 police policecar bri swat titus lightbar policedepartment blindé nexter bripp nikond7200"
	   },
	   {
			"title": "Les fourmis rouges",
			"link": "https://www.flickr.com/photos/drtatanne/26596056882/",
			"media": {"m":"https://farm2.staticflickr.com/1709/26596056882_8a6bd5d828_m.jpg"},
			"date_taken": "2016-04-16T14:13:34-08:00",
			"description": " <p><a href=\"https://www.flickr.com/people/drtatanne/\">Stéphane Dégremont<\/a> posted a photo:<\/p> <p><a href=\"https://www.flickr.com/photos/drtatanne/26596056882/\" title=\"Les fourmis rouges\"><img src=\"https://farm2.staticflickr.com/1709/26596056882_8a6bd5d828_m.jpg\" width=\"240\" height=\"160\" alt=\"Les fourmis rouges\" /><\/a><\/p> ",
			"published": "2016-04-28T10:32:00Z",
			"author": "nobody@flickr.com (Stéphane Dégremont)",
			"author_id": "53002345@N02",
			"tags": "street light blackandwhite paris noiretblanc blackandwhiteonly stéphanedégremont"
	   }
  ]
}
import React, { useEffect, useState } from "react";
import NewsItem from "./NewsItem";
import Spiner from "./Spiner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  
  const [articles , setArticles] = useState([]);
  const [loading , setLoading] = useState(true);
  const [page , setPage] = useState(1);
  const [totalResults , setTotalResults] = useState(0);
  
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
   
  const updateNews =  async() => {
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    
    setLoading(true);
    let data = await fetch(url);
    let parsedData = await data.json();
    setArticles(parsedData.articles);
    setTotalResults(parsedData.totalResults);
    setLoading(false) 
  }

  useEffect(() => {
    document.title=`${capitalizeFirstLetter(props.category)} - News Monkey`;
    updateNews();
  },[])
  
  
  const fetchMoreData = async () =>{
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
    setPage(page+1)
    let data = await fetch(url);
    let parsedData = await data.json();
    console.log(url);
    console.log(parsedData);

    setArticles(articles.concat(parsedData.articles));
    setTotalResults(parsedData.totalResults);
    setLoading(false);
  }
 
    return (
      <>
        <h2 className="text-center" style={{marginTop:"90px" }}>
          News Monkey - Top {capitalizeFirstLetter(props.category)} Headlines
        </h2>
        {loading && <Spiner />}
        
        <InfiniteScroll
          dataLength={(articles) && articles.length}
          next={fetchMoreData}
          hasMore={(articles) && articles.length !== totalResults}
          loader={<Spiner/>}
        >
        <div className="container my-4">
        <div className="row">
          { (articles) && articles.map((element) => {
              return (
                <div className="col-md-4" key={element.url}>
                  <NewsItem
                    title={element.title ? element.title : ""}
                    description={element.description ? element.description : ""}
                    imageUrl={element.urlToImage}
                    newsUrl={element.url}
                    author={element.author}
                    date={element.publishedAt}
                    source={element.source.name}
                  />
                </div>
              );
            })}
            </div>
            </div>
            </InfiniteScroll>
             
        
        <div className="container d-flex justify-content-between ">
          
        </div>
      </>
    );
 
}

News.defaultProps = {
  country: "in",
  pageSize: 8,
  category: "general",
  apiKey: "",
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
  apiKey:PropTypes.string,
};

export default News;

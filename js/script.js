'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagsLink: Handlebars.compile(document.querySelector('#template-tags-link').innerHTML),
  authorsLink: Handlebars.compile(document.querySelector('#template-authors-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorsCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML)
}

function titleClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  console.log('Link was clicked!');

  /* [DONE] remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');

  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }

  /* [IN PROGRESS] add class 'active' to the clicked link */
  console.log('clickedElement:', clickedElement);
  clickedElement.classList.add('active');

  /* remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts article.active');

  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }

  /* get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');
  console.log(articleSelector);

  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);
  console.log(targetArticle);

  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');
}

  const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author',
  optTagsListSelector = '.tags.list',
  optCloudClassCount = 5,
  optCloudClassPrefix = 'tag-size-',
  optAuthorsListSelector = '.list.authors';
  
function generateTitleLinks(customSelector = ''){
  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML='';
  let html = '';

  /* for each article */
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  console.log(articles);
  for(let article of articles){
    /* get the article id */
    const articleId = article.getAttribute('id');

    /* find the title element */
    /* get the title from the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;

    /* create HTML of the link */
   // const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
    console.log(linkHTML);

    /* insert link into html variable */
    html = html + linkHTML;
  }
  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');
  console.log(links);
  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

function calculateTagsParams(tags){  
  let min = 999999;
  let max = 1;
  const params = {max, min};

  for (let tag in tags){
    console.log(tag + ' is used ' + tags[tag] + ' times');
    if(tags[tag] > params.max){
      params.max = tags[tag];
    }
    if(tags[tag] < params.min){
      params.min = tags[tag];
    }
  }
  return params;
}

function calculateTagClass(count, params){
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );
  return optCloudClassPrefix+classNumber;
}

function generateTags(){
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll('article');
  /* START LOOP: for every article: */
  for(let article of articles){
    /* find tags wrapper */
    const tags = article.querySelector(optArticleTagsSelector);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    /* START LOOP: for each tag */
    for(let tag of articleTagsArray){
      /* generate HTML of the link */
      const linkHTMLData = {id: tag, tag: tag};
      const linkHTML = templates.tagsLink(linkHTMLData);
      //const linkHTML = '<li><a href="#tag-'+ tag +'">'+ tag +'</a></li>';
      console.log(linkHTML);
      /* add generated code to html variable */
      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags.hasOwnProperty(tag)){
      /* [NEW] add tag to allTags object*/
        allTags[tag] = 1;
      }else{
        allTags[tag]++;
      }
      html = html +' '+linkHTML;
      /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    tags.innerHTML = html;
    /* END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector('.tags');
  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams:', tagsParams);

  /* [NEW] creat variable for all links HTML code*/
  //let allTagsHTML = '';
  const allTagsData = {tags: []};
  /*[NEW] START LOOP: for each tag in allTags:*/
  for(let tag in allTags){
    //const tagLinkHTML = '<li><a class=' + calculateTagClass(allTags[tag], tagsParams) +" "+ 'href="#tag-'+ tag +'">'+" "+ tag +'</a></li>';
    const tagLinkHTML = {id: tag, tag: tag};
    // " (" + allTags[tag] + ") " + '</li>';
    console.log('tagLinkHTML', tagLinkHTML);
    /*[NEW] generate code of link and add it to allTagsHTML*/
    //allTagsHTML += tagLinkHTML;
    allTagsData.tags.push({
      id: tag,
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
  }
  /*[NEW] add html from allTagsHTML to tagList*/
  //tagList.innerHTML = allTagsHTML;
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
}
generateTags();

function tagClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  console.log('Tag was clicked!');
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  console.log(href);
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  /* find all tag links with class active */
  const tags = document.querySelectorAll('a.active[href^="#tag- "]');
  /* START LOOP: for each active tag link */
  for (let tagActive of tags){
    /* remove class active */
    tagActive.classList.remove('active');
  /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
    const tagLinks = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found tag link */
  for(let tagLink of tagLinks){
    /* add class active */
    tagLink.classList.add('active');
  /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  /* find all links to tags */
  const tagLinks = document.querySelectorAll('.list-horizontal a, .list.tags a');
  /* START LOOP: for each link */
  for(let tagLink of tagLinks){
    /* add tagClickHandler as event listener for that link */
    tagLink.addEventListener('click', tagClickHandler);
  }
  /* END LOOP: for each link */
}

addClickListenersToTags();

function generateAuthors(){
  let allAuthors = {};
  const allAuthorsData = {authors: []};
  const articles = document.querySelectorAll('article');
  for(let article of articles){
    const articleAuthors = article.querySelector(optArticleAuthorSelector);
    let html = '';
    const author = article.getAttribute('data-author');
    console.log(author);
    
    const linkHTMLData = {id: author, author: author};
    const linkHTML = templates.authorsLink(linkHTMLData);
    //const linkHTML = '<a href="' + author + '">'+ author +'</a>';
    console.log(linkHTML);
    
    if(!allAuthors.hasOwnProperty(author)){    
      allAuthors[author] = 1;
    }else{
      allAuthors[author]++;
    }
    html = html + linkHTML;
    articleAuthors.innerHTML = html;
  }
  const authorList = document.querySelector('.authors');
  let allAuthorsHTML='';
  for (let author in allAuthors){
    //const authorLinkHTML = '<li><a href="' + author + '">'+ author +"(" + allAuthors[author] + ")" + '</a></li>';
    const authorLinkHTML = {id: author, author: author};
    console.log('authorLinkHTML', authorLinkHTML);
   
    allAuthorsData.authors.push({
      id: author,
      author: author,
      count: allAuthors[author]
    });
   // allAuthorsHTML += authorLinkHTML;
  }
  //authorList.innerHTML = allAuthorsHTML;
  authorList.innerHTML = templates.authorsCloudLink(allAuthorsData);
}

generateAuthors();

function authorClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  console.log('Author was clicked');

  const authorSelector = clickedElement.getAttribute('href');
  console.log(authorSelector);

  generateTitleLinks('[data-author="' + authorSelector + '"]');
}

function addClickListenersToAuthor(){
  const authorLinks = document.querySelectorAll('.post-author a, .list.authors a');
  console.log(authorLinks)
  for(let authorLink of authorLinks){
    authorLink.addEventListener('click', authorClickHandler);
  }
}

addClickListenersToAuthor();

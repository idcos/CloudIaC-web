export default class SearchByKeyWord {

	lastKeyWord = '';
	keyword = '';
	
	highlightClassName = 'fn-highlight';
  searchWrapperSelect = '';
	excludeSearchClassNameList = [];

	constructor(props) {
	  const {
	    lineWrapperSelect = '',
	    searchWrapperSelect = '',
	    excludeSearchClassNameList = []
	  } = props || {};
	  this.lineWrapperSelect = lineWrapperSelect;
	  this.searchWrapperSelect = searchWrapperSelect;
	  this.excludeSearchClassNameList = excludeSearchClassNameList;
	}

	search(keyword) {
	  this.keyword = keyword;
	  if (this.keyword !== this.lastKeyWord) {
	    try {
	      this.cancelhighLight();
	      this.highLight();
	    } catch (error) {
	      // console.error(error);
	    }
	  }
	  this.lastKeyWord = keyword;
	}

	isExcludeSearchClassName(dom) {
	  if (this.excludeSearchClassNameList === 0) {
	    return false; 
	  }
	  let flag = false;
	  while (dom && this.findClassListIndex(dom.classList, '.line-text') === -1) {
	    if (this.isFindSameClass(dom.classList)) {
	      flag = true;
	      break;
	    } else {
	      dom = dom.parentNode;
	    }
	  }
	  return flag;
	}

	findClassListIndex(classList = [], className) {
	  let findIndex = -1;
	  classList.forEach((classItem, index) => {
	    if (className === classItem) {
	      findIndex = index;
	    }
	  });
	  return findIndex;
	}

	isFindSameClass(classList = []) {
	  const sameClassNameIndex =	this.excludeSearchClassNameList.findIndex((excludeSearchClassName) => {
	    return this.findClassListIndex(classList, excludeSearchClassName) !== -1;
	  });
	  return sameClassNameIndex !== -1;
	}
	
	highLight() {
	  if (!this.keyword) {
	    return; 
	  }
	  let index = 0;
	  let s = window.getSelection();
	  s.collapse(document.querySelector(this.searchWrapperSelect), 0);
	  while (window.find(this.keyword)) {
	    const range = s.getRangeAt(0);
	    if (this.isExcludeSearchClassName(range.commonAncestorContainer)) {
	      continue; 
	    }
	    var span_tag = document.createElement("SPAN");
	    span_tag.className = this.highlightClassName;
	    span_tag.id = 'highLight' + ++index;
	    range.surroundContents(span_tag);
	  }
	  if (index > 0) {
	    const firstHighLightDom = document.getElementById('highLight1');
	    firstHighLightDom.scrollIntoView();
	    // 选中第一个
	    const d = document.createRange();
	    d.selectNodeContents(firstHighLightDom);
	    s.removeAllRanges();
	    s.addRange(d);
	  }
	}

	cancelhighLight() {
	  const highlightDoms = document.querySelectorAll('.fn-highlight');
	  highlightDoms.forEach((highlightDom) => {
	    const content = highlightDom.innerHTML;
	    highlightDom.parentNode.replaceChild(document.createTextNode(content), highlightDom);
	  });
	}

}

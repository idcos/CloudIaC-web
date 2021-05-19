export default class SearchByKeyWord {

	keyword = ''
	lineWrapperSelect = '';


	constructor(props) {
	  const { lineWrapperSelect } = props || {};
	  this.lineWrapperSelect = lineWrapperSelect;
	}

	search(keyword) {
	  this.keyword = keyword;
	  if (!keyword) {
	    return; 
	  }
	  this.highLight();
	}

	highLight() {
	  this.cancelhighLight();
	  // changeDom(dom, searchText);
	}

	cancelhighLight() {
	  console.log('cancelhighLight');
	}


}

class SearchAndFilter {

  checkInput(min, max) {
    let msg = ""
    let result = true
    if(!Number.isInteger(Number(min)) || !Number.isInteger(Number(max))){
      msg += "* Credit number must be integer! "
      result = false
    }
    else{
      min = parseInt(min)
    max = parseInt(max)
    if(min < 0 || max < 0){
      msg += "* Credit number cannot be negative! "
      result = false
    }
    else{
      if(min > max){
        msg += "* Minimum credit number must be less than or equal to maximum credit number! "
        result = false
      }
    }
    }
    return [msg, result]
  }

  searchKeyword(input, keywords){
    let result = false;
    for(let i = 0; i < keywords.length; i++){
      if(keywords[i].includes(input)){
        result = true;
      }
    }
    return result;
  }

  searchAndFilter(courses, search, subject, minimumCredits, maximumCredits, interestArea) {
    if(!this.checkInput(minimumCredits, maximumCredits)[1]){
      return []
    }
    let result = []
    for(let i = 0; i < courses.length; i++){
      if((search != "" && !this.searchKeyword(search, courses[i].keywords)) || (subject != "All" && courses[i].subject != subject) || (minimumCredits != "" && parseInt(courses[i].credits) < parseInt(minimumCredits)) || (maximumCredits != "" && parseInt(courses[i].credits) > parseInt(maximumCredits)) || (interestArea != "All" && !this.searchKeyword(interestArea, courses[i].keywords))){
        continue;
      }
      result.push(courses[i]);
    }
    return result;
  }
}

export default SearchAndFilter;

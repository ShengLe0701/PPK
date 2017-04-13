
const Common = {
  number2StringByThousandComma(num) {
    if( num == null )
      return "0";

    var parts = num.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");  
  },

  string2NumberByThousandComma(str){
    if( str == null )
      return 0;

    return parseFloat(str.replace(/,/g,''));
  },
}

export default Common;
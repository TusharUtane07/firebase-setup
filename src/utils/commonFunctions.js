export function camelCaseToReadable(str) {
    if (!str) return '';
  
    // Insert a space before all uppercase letters and capitalize the first letter
    const result = str.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); });
  
    return result;
  }
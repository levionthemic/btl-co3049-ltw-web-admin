 function sanitizeInput(input) {
    if (!input) return "";
  
    return input
      // Remove script and iframe tags
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
      
      // Remove inline JS events
      .replace(/\s*on\w+="[^"]*"/gi, "")
      .replace(/\s*on\w+='[^']*'/gi, "")
  
      // Remove javascript: and data: urls
      .replace(/javascript:/gi, "")
      .replace(/data:text\/html/gi, "")
      
      // Escape HTML special characters
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
  
      // Remove common SQL injections
      .replace(/['";`]|--/g, "")
      .replace(/\b(SELECT|INSERT|DELETE|UPDATE|DROP|CREATE|ALTER|EXEC|UNION|TRUNCATE|REPLACE|MERGE)\b/gi, "")
      
      // Remove multiple whitespaces
      .replace(/\s{2,}/g, " ")
      .trim();
  }
  
  export default sanitizeInput;
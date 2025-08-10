import { useEffect } from 'react';

export const useDocumentTitle = (title) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} - CRM Pro`;
    
    return () => {
      document.title = previousTitle;
    };
  }, [title]);
};

export default useDocumentTitle;

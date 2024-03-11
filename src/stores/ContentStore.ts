import { useEffect, useState } from "react";
import * as contentful from 'contentful';

const CONTENTFUL_SPACE = 'wjpxigc6xst0';
const CONTENTFUL_TOKEN = '5Ou1FusTuLU69nIP5r9I2judAKB0VASfO9plFWZhFBE';
const CONTENTFUL_ARTICLE_DEMO_ID = '1nacNkzMjM8qx78J1GYdb1';
const LOCALHOST_ORIGIN = 'http://localhost:3000'

/**
 * client
 */
const client = contentful.createClient({
  space: CONTENTFUL_SPACE,
  accessToken: CONTENTFUL_TOKEN
});


export function useContentStore() {



  const [content, setContent] = useState<contentful.Entry<contentful.EntrySkeletonType>[]>([]);

  useEffect(() => {
    
    (async () => {
      const entries = await client.getEntries({
        content_type: 'article',
        'fields.articleType.sys.id': CONTENTFUL_ARTICLE_DEMO_ID,
        limit: 1000
      });

      setContent(entries.items);
    })();

  }, [])
  
  return content;
}
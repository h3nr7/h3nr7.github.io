// import { PointCloudOctree, Potree } from 'potree-loader'
import { useEffect, useState } from 'react'


export function usePotreeLoader(url: string) {
  // const potree = new Potree()
  // const [pointcloud, setPointcloud] = useState<PointCloudOctree>()
  
  useEffect(() => {

  //   async function pcLoad() {
  //     const pco = await potree.loadPointCloud(
  //         // The name of the point cloud which is to be loaded.
  //         'metadata.json',
  //         // Given the relative URL of a file, should return a full URL (e.g. signed).
  //         relativeUrl => `${url}/${relativeUrl}`
  //     )

  //     setPointcloud(pco)
  //   }

  //   pcLoad()

  }, [url])

  // return { pointcloud }
}
import { useQuery } from 'react-query'

const getDrugs = async <T>(
  _ : any,
  serverUrl: string,
  genes: string
) => {
  if (!genes) {
    return undefined
  }
  let data = await fetch('https://raw.githubusercontent.com/dotasek/drugcell-analysis-webapp/master/public/sample_result.json')
  let json = await data.json()

  return json.result
}

export default function useDrugs(
  serverUrl: string | undefined,
  genes: string
) {
  if (serverUrl === undefined) {
    throw new Error("Undefined serverUrl in useDrugs");
  }
  console.log('genes updated, running query:', genes)
  return useQuery(['drugs', serverUrl, genes], getDrugs)
}

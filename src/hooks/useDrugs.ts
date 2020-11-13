import { useQuery } from 'react-query'

const getDrugs = async <T>(
  _ : any,
  serverUrl: string,
  resultId: string
) => {
  if (!resultId) {
    return undefined
  }

  const resultUrl = `${serverUrl}v1/${resultId}`

  const cdapsResult = await waitForResult(resultUrl, 20);

  console.log('cdapsResult: ', cdapsResult);

  let data = await fetch('https://raw.githubusercontent.com/dotasek/drugcell-analysis-webapp/master/public/sample_result.json')
  let json = await data.json()

  return json.result
}

const waitForResult = async<T>(resultUrl: string, remainingAttempts: number) => {
  const result = await fetch(resultUrl);
  const resultJson = await result.json();
  
  if (remainingAttempts == 0) {
    return undefined
  }
  
  if (resultJson.status === 'complete') {
    return resultJson.result
  } else {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const result : any = await waitForResult(resultUrl, remainingAttempts - 1);
    return result
  }

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

import { useQuery } from 'react-query'

const getPathways = async <T>(
  _: any,
  serverUrl: string,
  drugId: string
) => {
  if (!drugId) {
    return undefined
  }

  const resultUrl = `${serverUrl}rlipp/fallmo100_rlipp_${drugId}.tsv`

  const pathwaysResult = await waitForResult(resultUrl, 20);
  if (pathwaysResult === undefined) {
    throw new Error('No response from server.')
  }
  return pathwaysResult
}

const waitForResult = async<T>(resultUrl: string, remainingAttempts: number) => {

  const result = await fetch(resultUrl).catch((error) => {
    //throw error
  });

  if (result) {
    //console.log('result status: ' + result.status + ' ' + result.statusText);
    if (result.status !== 200) {
      throw new Error( result.status + ' ' + result.statusText);
    }

    const resultJson = await result.json();

    if (remainingAttempts == 0) {
      return resultJson.result
    }

    if (resultJson.status === 'complete') {
      return resultJson.result
    } else {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const result: any = await waitForResult(resultUrl, remainingAttempts - 1);
      return result
    }
  }
}

export default function usePathways(
  serverUrl: string | undefined,
  drugId: string
) {
  if (serverUrl === undefined) {
    throw new Error("Undefined serverUrl in useDrugs");
  }
  //console.log('genes updated, running query:', resultId)
  return useQuery(['pathways', serverUrl, drugId], getPathways)
}

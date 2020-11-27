import { useQuery } from 'react-query'

const getDrugs = async <T>(
  _: any,
  serverUrl: string,
  resultId: string
) => {
  if (!resultId) {
    return undefined
  }

  const resultUrl = `${serverUrl}v1/${resultId}`

  const cdapsResult = await waitForResult(resultUrl, 20);
  if (cdapsResult === undefined) {
    throw new Error('No response from server.')
  }
  return cdapsResult
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

export default function useDrugs(
  serverUrl: string | undefined,
  resultId: string
) {
  if (serverUrl === undefined) {
    throw new Error("Undefined serverUrl in useDrugs");
  }
  //console.log('genes updated, running query:', resultId)
  return useQuery(['drugs', serverUrl, resultId], getDrugs)
}

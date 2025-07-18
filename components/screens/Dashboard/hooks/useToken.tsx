import { useEffect, useState } from 'react'
import { httpClientProvider } from '../../../../providers/HttpClientProvider'
import { tokenService } from '../../../../services/tokenService'

export function useToken() {
  const [hasToken, setHasToken] = useState(false)
  async function getTokenSession() {
    try {
      const response = await tokenService.getTokenSession(httpClientProvider)
      if (response.data?.status === 200) setHasToken(true)
      else window.location.href = '/login'
      return hasToken
    } catch (err) {
      window.location.href = '/login'
      return hasToken
    }
  }
  useEffect(() => {
    getTokenSession()
  }, [hasToken])

  return {
    getTokenSession,
  }
}

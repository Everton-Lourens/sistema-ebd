import { useRef, useState, useEffect } from 'react'
import style from './ChatTableComponent.module.scss'
import { Column } from './interfaces'
import { Skeleton } from '@mui/material'
import { ClientChatbotDTO, defaultClient } from '../../../dtos/ClientDTOS'

interface Props {
  columns: Column[]
  rows: any[]
  loading: boolean
  chatbot: (client: ClientChatbotDTO) => Promise<ClientChatbotDTO>
  emptyText?: string
  heightSkeleton?: number
}
export function ChatTableComponent({
  columns,
  rows,
  loading,
  chatbot,
  emptyText,
  heightSkeleton = 30,
}: Props) {
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const [message, setMessage] = useState('')
  const [client, setClient] = useState<ClientChatbotDTO>(defaultClient)

  const formatText = (text?: string) => {
    if (!text) return null
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ))
  }

  const speakWithBot = async (message: string) => {
    if (!message || message.trim() === '') {
      return false
    }
    const newMessageClient = {
      _id: (rows.length + 1).toString(),
      clientMessage: message,
    }
    rows.push(newMessageClient)
    client.message = message
    const chatbotResponse = await chatbot(client)
    setClient((prev) => ({ ...prev, ...chatbotResponse }))
    const response = formatText(chatbotResponse?.response)
    const newMessageChatbot = {
      _id: (rows.length + 1).toString(),
      chatbotMessage: response,
    }
    rows.push(newMessageChatbot)
  }
  useEffect(() => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 200)
  }, [message, rows])
  return (
    <div style={{ overflowY: 'auto' }}>
      <table style={loading ? { opacity: 0.5 } : {}} className={style.table}>
        <tbody className={style.chatContainer}>
          {rows.length > 0 &&
            !loading &&
            rows?.map((row) => {
              return (
                <tr
                  key={row._id}
                  className={
                    row.clientMessage ? style.bubbleClient : style.bubbleChatbot
                  }
                >
                  {columns.map((column) => {
                    return (
                      <td
                        className={column?.cellClass?.({
                          value: row[column.field],
                          data: row,
                        })}
                        key={column.field}
                        style={{ flex: 1 }}
                      >
                        {column?.valueFormatter?.({
                          value: row[column.field],
                          data: row,
                        }) && row[column.field]}
                      </td>
                    )
                  })}
                </tr>
              )
            })}

          <tr className={style.emptyRow}>
            <td className={style.emptyCell} colSpan={columns.length}>
              <div ref={bottomRef} />
            </td>
          </tr>
          {rows.length === 0 && !loading && (
            <tr className={style.emptyRow}>
              <td className={style.emptyCell} colSpan={columns.length}>
                <p>{emptyText || 'Nenhum item encontrado'}</p>
              </td>
            </tr>
          )}

          {loading &&
            [1, 2, 3, 4, 5].map((item) => {
              return (
                <tr key={item}>
                  {columns.map((column) => {
                    return (
                      <td
                        className={style.skeleton}
                        key={column.field}
                        style={{ flex: 1 }}
                      >
                        <Skeleton
                          variant="rounded"
                          height={heightSkeleton}
                          sx={{ fontSize: '1rem', borderRadius: 15 }}
                        />
                      </td>
                    )
                  })}
                </tr>
              )
            })}
        </tbody>
        {!loading && (
          <div className={style.chatInputContainer}>
            <input
              type="text"
              className={style.chatInput}
              placeholder="Digite uma mensagem..."
              autoFocus
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  speakWithBot(message)
                  setMessage('')
                }
              }}
            />
            <button
              className={style.sendButton}
              onClick={() => {
                speakWithBot(message)
                setMessage('')
              }}
            >
              Enviar
            </button>
          </div>
        )}
      </table>
      <div ref={bottomRef} />
    </div>
  )
}

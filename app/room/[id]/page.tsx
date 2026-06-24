'use client'
import Client from '../../client'
import {useParams, useSearchParams} from 'next/navigation'

export default function Room() {
    const params = useParams<{id: string}>()
    const searchParams = useSearchParams()
    const name = searchParams.get('name') ?? 'Anonym'

    return (
        <div>
            <Client />
            <h1>Room {params?.id}</h1>
            <p> Name: {name}</p>
        </div>
    )
}   
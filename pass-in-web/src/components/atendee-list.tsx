import { Search, MoreHorizontal, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react"
import dayjs from "dayjs";
import 'dayjs/locale/pt-br'
import relativeTime from 'dayjs/plugin/relativeTime';
import { IconButton } from "./icon-button"
import { Table } from './table/table';
import { TableHeader } from "./table/table-header"
import { TableCell } from "./table/table-cell";
import { TableRow } from "./table/table-row";
import { ChangeEvent, useEffect, useState } from "react";
//import { atendees } from "../data/atendees"; não preciso importar pois vamos usar a requisição a nossa API de atendees ao invés do faker

dayjs.extend(relativeTime)
dayjs.locale('pt-br')

interface Atendee {
    id: string,
    name: string,
    email: string,
    createdAt: string,
    checkedInAt: string | null,
}

export function AtendeeList(){

    const [search, setSearch] = useState(() => {
        const url = new URL(window.location.toString())

        if(url.searchParams.has('search')){
            return url.searchParams.get('search') ?? ''
        }

        return ''
    })
    const [page, setPage] = useState(() => {
        const url = new URL(window.location.toString())

        if(url.searchParams.has('page')){
            return Number(url.searchParams.get('page'))
        }

        return 1
    })
    const [total, setTotal] = useState(0)
    const [atendees, setAtendees] = useState<Atendee[]>([])

    const totalPages = Math.ceil(total / 10)

    useEffect(() => {
        const url = new URL('http://localhost:3333/events/9e9bd979-9d10-4915-b339-3786b1634f33/atendees')
        url.searchParams.set('pageIndex', String(page -1))

        if(search.length > 0){
            url.searchParams.set('query', search)
        }
        
        fetch(url)
        .then(response => response.json())
        .then(data => {
            setAtendees(data.atendees)
            setTotal(data.total)
        })
    }, [page, search])

    function setCurrentPage(page: number){
        const url = new URL(window.location.toString())
        url.searchParams.set('page', String(page))
        window.history.pushState({}, "", url)
        setPage(page)
    }

    function setCurrentSearch(search: string){
        const url = new URL(window.location.toString())
        url.searchParams.set('search', search)
        window.history.pushState({}, "", url)
        setSearch(search)
    }


    function onSearchInputChanged(event: ChangeEvent<HTMLInputElement>){
        setCurrentSearch(event.target.value)
        setCurrentPage(1)
    }

    function goToFirstPage(){
        setCurrentPage(1)
    }

    function goToNextPage(){
        //setPage(page+1)
        setCurrentPage(page+1)
    }

    function goToPreviousPage(){
        setCurrentPage(page-1)
    }

    function goToLastPage(){
        setCurrentPage(totalPages)
    }
    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-3 items-center">
                <h1 className="text-2xl font-bold">Participantes</h1>
                <div className="w-72 px-3 py-1.5 border border-white/10 bg-transparent rounded-lg text-sm flex items-center gap-3">
                    <Search className="size-4 text-emerald-300"/>
                    <input value={search} onChange={onSearchInputChanged} className="bg-transparent flex-1 outline-none border-0 p-0 text-sm focus:ring-0"  placeholder="Buscar participante..." />
                </div>
            </div>

            <Table>
                <thead>
                    <tr className="border-b border-white/10">
                        <TableHeader style={{width: 48}} className="py-3 px-4 text-sm font-semibold text-left checked:bg-orange-400">
                            <input type="checkbox" className="size-4 bg-black/20 rouded border-white/10 "/>
                        </TableHeader>
                        <TableHeader>Código</TableHeader>
                        <TableHeader>Participante</TableHeader>
                        <TableHeader>Data de inscrição</TableHeader>
                        <TableHeader>Data de check-in</TableHeader>
                        <TableHeader style={{width: 64}}></TableHeader>
                    </tr>
                </thead>
                <tbody>
                    {atendees.map((atendee) => {
                        return (
                            <TableRow key={atendee.id}>
                                <TableCell>
                                    <input type="checkbox" className="size-4 bg-black/20 rouded border-white/10 " />
                                </TableCell>
                                <TableCell>{atendee.id}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <span className="font-semibold text-white">{atendee.name}</span>
                                        <span>{atendee.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{dayjs().to(atendee.createdAt)}</TableCell>
                                <TableCell>
                                    {atendee.checkedInAt === null 
                                    ? <span className="text-zinc-400">Não fez check-in</span>
                                    : dayjs().to(atendee.checkedInAt)}
                                </TableCell>
                                <TableCell>
                                    <IconButton transparent>
                                        <MoreHorizontal className="size-4" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </tbody>
                <tfoot>
                    <TableCell colSpan={3}>
                        Mostrando {atendees.length} de {total} itens
                    </TableCell>
                    <TableCell colSpan={3} className="text-right">
                        <div className="inline-flex items-center gap-8">
                            <span>Página {page} de {totalPages}</span>
                            <div className="flex gap-1.5">
                                <IconButton onClick={goToFirstPage} disabled={page === 1}>
                                    <ChevronsLeft className="size-4" />
                                </IconButton>
                                <IconButton onClick={goToPreviousPage} disabled={page === 1}>
                                    <ChevronLeft className="size-4" />
                                </IconButton>
                                <IconButton onClick={goToNextPage} disabled={page === totalPages}>
                                    <ChevronRight className="size-4" />
                                </IconButton>
                                <IconButton onClick={goToLastPage} disabled={page === totalPages}>
                                    <ChevronsRight className="size-4" />
                                </IconButton>
                            </div>
                        </div>
                    </TableCell>
                </tfoot>
            </Table>
        </div>
    )
}
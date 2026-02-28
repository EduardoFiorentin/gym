[
	{
		"id": "11111111-aaaa-aaaa-aaaa-111111111111",
		"treinoId": "aaaaaaaa-1111-1111-1111-aaaaaaaaaaaa",
		"treinoName": "A - Peito e Tríceps",
		"startedAt": "2026-02-16T17:42:34.398+00:00",
		"finishedAt": "2026-02-16T18:42:34.398+00:00"
	},
	{
		"id": "22222222-bbbb-bbbb-bbbb-222222222222",
		"treinoId": "bbbbbbbb-2222-2222-2222-bbbbbbbbbbbb",
		"treinoName": "B - Pernas",
		"startedAt": "2026-02-15T19:42:34.398+00:00",
		"finishedAt": "2026-02-15T20:42:34.398+00:00"
	}
]

export interface ITreinamentoHistoryDTO {
    id: string,
    treinoId: string,
    treinoName: string,
    startedAt: string,
    finishedAt: string
}
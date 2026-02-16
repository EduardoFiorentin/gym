-- Mock data to initial database version
INSERT INTO public.users (id,email,login,"name","password") VALUES
	 ('6645ac83-adef-4a48-b26d-516a9bc4370b','eduardo@gmail.com','eduardo','Eduardo Fiorentin','$2a$10$JmHASUiV/oDiFfoL8p3L2uQ2Gb4mQWatK0aiXvrbjS587bcjtx6Y6'),
	 ('246cd543-ef60-4786-a4df-19a7cdcef66c','eduarda@gmail.com','eduarda','Eduarda Rampaneli','$2a$10$h5x258PV1o35ziMQrCXwzOl4k1aeUh8xTjLXQgqnDxKk132z527LG'),
	 ('f627c4b1-b982-4d3d-93af-55191fb6c7b3','manager@gmail.com','manager','Manager','$2a$10$zwfrRLZHehDAhkyhp.0nL.9zGyt2AtpEtQSKC0KSBz/QImypexDRi');

INSERT INTO public.roles (id,"name") VALUES
	 ('649a1a65-6182-4634-86a2-441548816f23','ADMIN'),
	 ('8662c1f7-84e9-42bf-a531-b73169246547','USER'),
	 ('3016a13b-a321-4ea8-81f8-cf3dcb234057','MANAGER');

INSERT INTO public.users_roles (user_id,role_id) VALUES
	 ('6645ac83-adef-4a48-b26d-516a9bc4370b','649a1a65-6182-4634-86a2-441548816f23'),
	 ('6645ac83-adef-4a48-b26d-516a9bc4370b','8662c1f7-84e9-42bf-a531-b73169246547'),
	 ('246cd543-ef60-4786-a4df-19a7cdcef66c','8662c1f7-84e9-42bf-a531-b73169246547'),
	 ('f627c4b1-b982-4d3d-93af-55191fb6c7b3','8662c1f7-84e9-42bf-a531-b73169246547'),
	 ('f627c4b1-b982-4d3d-93af-55191fb6c7b3','649a1a65-6182-4634-86a2-441548816f23'),
	 ('f627c4b1-b982-4d3d-93af-55191fb6c7b3','3016a13b-a321-4ea8-81f8-cf3dcb234057');


INSERT INTO public.un_medida (id, name, abv) 
VALUES 
	('c1c1c1c1-1111-1111-1111-c1c1c1c1c1c1', 'Quilogramas', 'kg');

INSERT INTO public.treino (id, name, user_id) 
VALUES 
	('aaaaaaaa-1111-1111-1111-aaaaaaaaaaaa', 'A - Peito e Tríceps', '6645ac83-adef-4a48-b26d-516a9bc4370b'),
	('bbbbbbbb-2222-2222-2222-bbbbbbbbbbbb', 'B - Pernas', '6645ac83-adef-4a48-b26d-516a9bc4370b');

INSERT INTO public.exercicio (id, name, treino_id, un_id) 
VALUES
	('a0000001-1111-1111-1111-aaaaaaaaaaaa', 'Supino Reto', 'aaaaaaaa-1111-1111-1111-aaaaaaaaaaaa', 'c1c1c1c1-1111-1111-1111-c1c1c1c1c1c1'),
	('a0000002-1111-1111-1111-aaaaaaaaaaaa', 'Crucifixo Inclinado', 'aaaaaaaa-1111-1111-1111-aaaaaaaaaaaa', 'c1c1c1c1-1111-1111-1111-c1c1c1c1c1c1'),
	('a0000003-1111-1111-1111-aaaaaaaaaaaa', 'Tríceps Pulley', 'aaaaaaaa-1111-1111-1111-aaaaaaaaaaaa', 'c1c1c1c1-1111-1111-1111-c1c1c1c1c1c1'),
	('a0000004-1111-1111-1111-aaaaaaaaaaaa', 'Tríceps Testa', 'aaaaaaaa-1111-1111-1111-aaaaaaaaaaaa', 'c1c1c1c1-1111-1111-1111-c1c1c1c1c1c1'),
	('b0000001-2222-2222-2222-bbbbbbbbbbbb', 'Agachamento Livre', 'bbbbbbbb-2222-2222-2222-bbbbbbbbbbbb', 'c1c1c1c1-1111-1111-1111-c1c1c1c1c1c1'),
	('b0000002-2222-2222-2222-bbbbbbbbbbbb', 'Leg Press 45', 'bbbbbbbb-2222-2222-2222-bbbbbbbbbbbb', 'c1c1c1c1-1111-1111-1111-c1c1c1c1c1c1'),
	('b0000003-2222-2222-2222-bbbbbbbbbbbb', 'Cadeira Extensora', 'bbbbbbbb-2222-2222-2222-bbbbbbbbbbbb', 'c1c1c1c1-1111-1111-1111-c1c1c1c1c1c1'),
	('b0000004-2222-2222-2222-bbbbbbbbbbbb', 'Cadeira Flexora', 'bbbbbbbb-2222-2222-2222-bbbbbbbbbbbb', 'c1c1c1c1-1111-1111-1111-c1c1c1c1c1c1');

INSERT INTO public.treinamento (id, treino_id, started_at, finished_at) 
VALUES
	('11111111-aaaa-aaaa-aaaa-111111111111', 'aaaaaaaa-1111-1111-1111-aaaaaaaaaaaa', CURRENT_TIMESTAMP - interval '2 hours', CURRENT_TIMESTAMP - interval '1 hour'),
	('22222222-bbbb-bbbb-bbbb-222222222222', 'bbbbbbbb-2222-2222-2222-bbbbbbbbbbbb', CURRENT_TIMESTAMP - interval '1 day', CURRENT_TIMESTAMP - interval '23 hours');

INSERT INTO public.serie (treinamento_id, exercicio_id, magnitude, execucoes, created_at) 
VALUES
	('11111111-aaaa-aaaa-aaaa-111111111111', 'a0000001-1111-1111-1111-aaaaaaaaaaaa', 20.00, 10, '2025-02-15 22:41:00'), -- Supino Reto: Série 1
	('11111111-aaaa-aaaa-aaaa-111111111111', 'a0000001-1111-1111-1111-aaaaaaaaaaaa', 20.00, 10, '2025-02-15 22:42:00'), -- Supino Reto: Série 2
	('11111111-aaaa-aaaa-aaaa-111111111111', 'a0000001-1111-1111-1111-aaaaaaaaaaaa', 25.00, 10, '2025-02-15 22:43:00'), -- Supino Reto: Série 3
	('11111111-aaaa-aaaa-aaaa-111111111111', 'a0000002-1111-1111-1111-aaaaaaaaaaaa', 12.00, 10, '2025-02-15 22:44:00'), -- Crucifixo Inclinado
	('11111111-aaaa-aaaa-aaaa-111111111111', 'a0000002-1111-1111-1111-aaaaaaaaaaaa', 12.00, 10, '2025-02-15 22:45:00'), 
	('11111111-aaaa-aaaa-aaaa-111111111111', 'a0000002-1111-1111-1111-aaaaaaaaaaaa', 12.00, 10, '2025-02-15 22:46:00'), 
	('11111111-aaaa-aaaa-aaaa-111111111111', 'a0000003-1111-1111-1111-aaaaaaaaaaaa', 15.00, 10, '2025-02-15 22:47:00'), -- Tríceps Pulley
	('11111111-aaaa-aaaa-aaaa-111111111111', 'a0000003-1111-1111-1111-aaaaaaaaaaaa', 20.00, 10, '2025-02-15 22:48:00'), 
	('11111111-aaaa-aaaa-aaaa-111111111111', 'a0000003-1111-1111-1111-aaaaaaaaaaaa', 20.00, 10, '2025-02-15 22:49:00'), 
	('11111111-aaaa-aaaa-aaaa-111111111111', 'a0000004-1111-1111-1111-aaaaaaaaaaaa', 10.00, 10, '2025-02-15 22:51:00'), -- Tríceps Testa
	('11111111-aaaa-aaaa-aaaa-111111111111', 'a0000004-1111-1111-1111-aaaaaaaaaaaa', 10.00, 10, '2025-02-15 22:52:00'), 
	('11111111-aaaa-aaaa-aaaa-111111111111', 'a0000004-1111-1111-1111-aaaaaaaaaaaa', 10.00, 10, '2025-02-15 22:53:00'),
	('22222222-bbbb-bbbb-bbbb-222222222222', 'b0000001-2222-2222-2222-bbbbbbbbbbbb', 40.00, 10, '2025-02-15 22:54:00'), -- Agachamento Livre
	('22222222-bbbb-bbbb-bbbb-222222222222', 'b0000001-2222-2222-2222-bbbbbbbbbbbb', 50.00, 10, '2025-02-15 22:55:00'), 
	('22222222-bbbb-bbbb-bbbb-222222222222', 'b0000001-2222-2222-2222-bbbbbbbbbbbb', 60.00, 10, '2025-02-15 22:56:00'), 
	('22222222-bbbb-bbbb-bbbb-222222222222', 'b0000002-2222-2222-2222-bbbbbbbbbbbb', 120.00, 10, '2025-02-15 22:57:00'), -- Leg Press 45
	('22222222-bbbb-bbbb-bbbb-222222222222', 'b0000002-2222-2222-2222-bbbbbbbbbbbb', 140.00, 10, '2025-02-15 22:58:00'), 
	('22222222-bbbb-bbbb-bbbb-222222222222', 'b0000002-2222-2222-2222-bbbbbbbbbbbb', 160.00, 10, '2025-02-15 22:59:00'), 
	('22222222-bbbb-bbbb-bbbb-222222222222', 'b0000003-2222-2222-2222-bbbbbbbbbbbb', 30.00, 10, '2025-02-15 23:00:00'), -- Cadeira Extensora
	('22222222-bbbb-bbbb-bbbb-222222222222', 'b0000003-2222-2222-2222-bbbbbbbbbbbb', 35.00, 10, '2025-02-15 23:01:00'), 
	('22222222-bbbb-bbbb-bbbb-222222222222', 'b0000003-2222-2222-2222-bbbbbbbbbbbb', 40.00, 10, '2025-02-15 23:02:00'), 
	('22222222-bbbb-bbbb-bbbb-222222222222', 'b0000004-2222-2222-2222-bbbbbbbbbbbb', 30.00, 10, '2025-02-15 23:03:00'), -- Cadeira Flexora
	('22222222-bbbb-bbbb-bbbb-222222222222', 'b0000004-2222-2222-2222-bbbbbbbbbbbb', 35.00, 10, '2025-02-15 23:04:00'), 
	('22222222-bbbb-bbbb-bbbb-222222222222', 'b0000004-2222-2222-2222-bbbbbbbbbbbb', 40.00, 10, '2025-02-15 23:05:00');

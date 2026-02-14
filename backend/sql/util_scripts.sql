select * from users u ;
select * from roles r ;
--
--alter table users
--drop column role;

select u."login", r."name"  from users_roles ur 
join users u on u.id = ur.user_id 
join roles r on r.id = ur.role_id;


-- Insere permissões ADMIN e MANAGER para usuario
WITH perm_user_id AS (
    SELECT id FROM users WHERE login = 'eduarda'
)
INSERT INTO users_roles (user_id, role_id)
SELECT id, '4b7fa9e9-adf3-411e-bce0-e3652c2ecc16' FROM perm_user_id
UNION ALL
SELECT id, '9856b4ff-fabc-456d-8405-4c36f5a4d936' FROM perm_user_id;

-- Deleta qualquer usuário do jeito certo com um comando (removendo referências estrangeiras)
call proc_delete_user_and_roles('teste');




create or replace procedure proc_delete_user_and_roles(
	p_login varchar
)
language plpgsql 
as $$
begin
	
	DELETE FROM users_roles ur where ur.user_id = (select id from users u where login = p_login);
	DELETE FROM users u WHERE u.login = p_login;

end
$$;

drop procedure proc_delete_user_and_roles;







































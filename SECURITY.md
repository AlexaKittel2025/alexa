# Segurança do Mentei App

Este documento descreve as práticas de segurança implementadas no projeto e as diretrizes para manter a aplicação segura.

## Práticas de Segurança Implementadas

### 1. Autenticação e Autorização
- NextAuth.js para gerenciamento de sessões
- JWT tokens com expiração configurável
- Middleware de proteção de rotas privadas
- Validação de tokens em todas as requisições de API

### 2. Proteção contra Vulnerabilidades Comuns
- **XSS (Cross-Site Scripting)**: 
  - Sanitização de inputs do usuário
  - CSP headers configurados em produção
  - Escape automático de conteúdo pelo React

- **CSRF (Cross-Site Request Forgery)**:
  - Tokens CSRF em formulários
  - Validação de origem das requisições
  - Headers de segurança

- **SQL Injection**:
  - Prisma ORM com queries parametrizadas
  - Validação de entrada de dados

### 3. Cabeçalhos de Segurança HTTP
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: same-origin
- Strict-Transport-Security (HSTS) em produção

### 4. Segurança de Dados
- Senhas hasheadas com bcrypt
- Dados sensíveis nunca expostos em logs
- Comunicação HTTPS em produção
- Tokens de API com expiração

### 5. Variáveis de Ambiente
- Arquivo .env.example fornecido sem dados sensíveis
- Arquivos .env locais ignorados pelo Git
- Separação de configurações por ambiente

## Diretrizes para Desenvolvedores

### 1. Nunca Faça Commit de:
- Credenciais ou chaves de API
- Arquivos .env ou similares
- Dados de usuários ou informações pessoais
- Certificados SSL ou chaves privadas

### 2. Sempre:
- Use variáveis de ambiente para dados sensíveis
- Valide e sanitize todos os inputs de usuários
- Implemente rate limiting em endpoints públicos
- Mantenha dependências atualizadas
- Teste recursos de segurança antes de deploy

### 3. Antes de Deploy:
- Revise configurações de segurança
- Execute testes de segurança
- Verifique logs por informações sensíveis
- Configure HTTPS e headers de segurança
- Atualize dependências com vulnerabilidades

## Reporting de Vulnerabilidades

Se você descobrir uma vulnerabilidade de segurança, por favor:

1. NÃO abra uma issue pública
2. Envie detalhes para [email de segurança]
3. Inclua:
   - Descrição da vulnerabilidade
   - Passos para reproduzir
   - Impacto potencial
   - Sugestões de correção (se houver)

## Checklist de Segurança

### Deploy
- [ ] Todas as variáveis de ambiente configuradas
- [ ] HTTPS habilitado
- [ ] Headers de segurança configurados
- [ ] Rate limiting implementado
- [ ] Logs não expõem dados sensíveis
- [ ] Dependências atualizadas

### Desenvolvimento
- [ ] Nenhuma credencial hardcoded
- [ ] Inputs validados
- [ ] Queries parametrizadas
- [ ] Autenticação em rotas privadas
- [ ] Testes de segurança executados

## Recursos Adicionais

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Prisma Security](https://www.prisma.io/docs/guides/security)
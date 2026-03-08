# Product Definition

## Project Name

Oscar

## Description

Uma aplicação web que gerencia bolões do Oscar. Cada bolão é iniciado por um usuário que se torna administrador daquele bolão. Ele pode convidar pessoas para participar por meio de um link que exige um cadastro simples baseado em usuário e senha. No bolão, cada participante preenche seu palpite de qual filme (ou pessoa) irá ganhar o Oscar em cada categoria. O sistema de apostas fica disponível até o momento da cerimônia de premiação começar. Depois disso, o sistema permite que o administrador geral atualize os resultados. Os bolões exibem uma tela de resultados com classificação baseada em um sistema de pontuação.

## Problem Statement

Organizar bolões do Oscar entre amigos é trabalhoso e manual, geralmente feito em planilhas ou grupos de WhatsApp. Não existe uma forma prática de gerenciar apostas, calcular pontuações e exibir rankings para bolões do Oscar.

## Target Users

Grupos de amigos e familiares que fazem bolões do Oscar.

## Scoring System

| Tier | Categorias | Pontos |
|------|-----------|--------|
| Ouro | Melhor Filme | 10 |
| Prata | Melhor Diretor, Melhor Ator, Melhor Atriz, Melhor Ator Coadjuvante, Melhor Atriz Coadjuvante | 5 |
| Bronze | Melhor Roteiro Original, Melhor Roteiro Adaptado, Melhor Animação, Melhor Filme Estrangeiro | 3 |
| Base | Todas as demais categorias | 1 |

## Key Goals

1. **Simplicidade de uso** — criar bolão e convidar amigos em poucos cliques
2. **Cálculo automático de pontuação e ranking em tempo real**
3. **Experiência mobile-first** para acompanhar durante a cerimônia

## Desirable Features

- Atualização automática e em tempo real das categorias já premiadas, sem necessidade de um administrador atualizar manualmente

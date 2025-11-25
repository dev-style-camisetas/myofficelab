import { prismaClient } from "../prisma/prisma";
import type { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import type { Request, Response } from "express";
import { verifyAccess } from "../utils/jwt";

enum produtoColumns {
  TAMANHO = "tamanho",
  MODELO = "modelo",
  TECIDO = "tecido",
  COR = "cor",
  ESTAMPA = "estampa",
  BLOCO = "bloco",
}

export const createProduto = async (req: Request, res: Response) => {
  const { body } = req;
  try {
    const token = req.headers.authorization?.slice("Bearer ".length) || "";
    const payload = verifyAccess(token) as { userId: number };

    const { tamanho, modelo, tecido, cor, estampa, bloco } = body;

    if (!tamanho || !modelo || !tecido || !cor || !estampa || !bloco) {
      return res.status(400).json({
        error: "Todos os campos de produto são obrigatórios.",
      });
    }

    const produto = await prismaClient.produto.create({
      data: {
        tamanho,
        modelo,
        tecido,
        cor,
        estampa,
        bloco,
        userId: payload.userId,
      },
    });

    res.status(201).json(produto);
  } catch (error) {
    res.status(500).send(`Erro no servidor: ${error}`);
  }
};

export const listProdutos = async (_: Request, res: Response) => {
  try {
    const produtos = await prismaClient.produto.findMany();
    res.json(produtos);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Erro no servidor: ${error}`);
  }
};

export const listProdutoById = async (req: Request, res: Response) => {
  try {
    const { params } = req;

    const produto = await prismaClient.produto.findUnique({
      where: {
        id: Number(params.id),
      },
    });

    if (!produto) {
      return res.status(404).json({
        message: "Produto não existe no banco de dados.",
      });
    }

    res.json(produto);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Erro no servidor: ${error}`);
  }
};

export const updateProduto = async (req: Request, res: Response) => {
  try {
    const { params, body } = req;

    const token = req.headers.authorization?.slice("Bearer ".length) || "";
    const payload = verifyAccess(token) as { userId: number };

    const bodyKeys: string[] = Object.keys(body);
    for (const key of bodyKeys) {
      if (
        key !== produtoColumns.TAMANHO &&
        key !== produtoColumns.MODELO &&
        key !== produtoColumns.TECIDO &&
        key !== produtoColumns.ESTAMPA &&
        key !== produtoColumns.COR &&
        key !== produtoColumns.BLOCO
      ) {
        return res.status(400).send("Colunas não existentes");
      }
    }

    const produtoToUpdate = await prismaClient.produto.findUnique({
      where: {
        id: Number(params.id),
      },
    });

    if (!produtoToUpdate) {
      return res.status(404).send("Produto não encontrado!");
    }

    if (produtoToUpdate.userId !== payload.userId) {
      return res.status(403).send("Produto não pertence ao usuário");
    }

    const produto = await prismaClient.produto.update({
      where: { id: Number(params.id) },
      data: {
        ...body,
      },
    });

    res.status(200).json({
      message: "Produto atualizado!",
      data: produto,
    });
  } catch (error) {
    if ((error as PrismaClientKnownRequestError).code === "P2025") {
      res.status(404).send("Produto não encontrado!");
    }
    console.log(error);
    res.status(500).send(`Erro no servidor: ${error}`);
  }
};

export const deleteProduto = async (req: Request, res: Response) => {
  try {
    const { params } = req;
    const token = req.headers.authorization?.slice("Bearer ".length) || "";
    const payload = verifyAccess(token) as { userId: number };

    const produtoToDelete = await prismaClient.produto.findUnique({
      where: {
        id: Number(params.id),
      },
    });

    if (!produtoToDelete) {
      return res.status(404).send("Produto não encontrado!");
    }

    if (produtoToDelete.userId !== payload.userId) {
      return res.status(403).send("Produto não pertence ao usuário");
    }

    await prismaClient.produto.delete({
      where: {
        id: Number(params.id),
      },
    });

    res.status(200).send("Produto deletado com sucesso!");
  } catch (error) {
    if ((error as PrismaClientKnownRequestError).code === "P2025") {
      res.status(404).send("Produto não encontrado!");
    }
    console.log(error);
    res.status(500).send(`Erro no servidor: ${error}`);
  }
};

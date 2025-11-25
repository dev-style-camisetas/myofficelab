import { prismaClient } from "../prisma/prisma";
import type { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import type { Request, Response } from "express";
import { verifyAccess } from "../utils/jwt.ts";
import { simuladorService } from "../services/simuladorService";

enum pedidoColumns {
  STATUS = "status",
  USER_ID = "userId",
  CREATED_AT = "createdAt",
  UPDATED_AT = "updatedAt",
}

export const createPedido = async (req: Request, res: Response) => {
  const { body } = req;
  const { produtos, status = "PEDIDO_RECEBIDO", ...dados } = body;

  try {
    const token = req.headers.authorization?.slice("Bearer ".length);
    const payload = verifyAccess(token || "") as { userId: number };

    if (!Array.isArray(produtos) || produtos.length === 0) {
      return res.status(400).json({ error: "Produtos são obrigatórios." });
    }

    let produtoIds: number[] = [];
    const quantidadeMap = new Map<number, number>();

    if (typeof produtos[0] === "number") {
      produtoIds = produtos as number[];
      produtoIds.forEach((id) => quantidadeMap.set(id, 1));
    } else {
      produtoIds = (produtos as any[]).map((p) => Number(p.id));
      (produtos as any[]).forEach((p) =>
        quantidadeMap.set(Number(p.id), Number(p.quantidade) || 1)
      );
    }

    const produtosDb = await prismaClient.produto.findMany({
      where: { id: { in: produtoIds } },
    });

    if (produtosDb.length === 0) {
      return res.status(400).json({ error: "Nenhum produto encontrado." });
    }

    const results: Array<any> = [];

    for (const produto of produtosDb) {
      const qtd = quantidadeMap.get(produto.id) || 1;

      const pedidoItem = await prismaClient.pedido.create({
        data: {
          ...dados,
          status,
          userId: payload.userId,
        },
      });

      await prismaClient.produtosEmPedidos.create({
        data: {
          id_pedido: pedidoItem.id,
          id_produto: produto.id,
          quantidade: qtd,
        },
      });

      const produtoForSimulador = {
        bloco: produto.bloco,
        quantidade: qtd,
      };

      try {
        const resultado = await simuladorService.enviarPedidoParaFila(
          pedidoItem,
          [produtoForSimulador]
        );
        console.log(
          "Enviado para simulador/bancada com sucesso!",
          resultado?.status
        );
        results.push({ pedidoId: pedidoItem.id, ok: true });
      } catch (simError: any) {
        console.error(
          "Erro ao enviar para o simulador/bancada:",
          simError.response?.data || simError.message || simError
        );
        results.push({ pedidoId: pedidoItem.id, ok: false });
      }
    }

    return res.status(201).json({
      message: "Pedidos criados",
      results,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const listPedidos = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.slice("Bearer ".length);
    const payload = verifyAccess(token || "") as { userId: number };

    const pedidos = await prismaClient.pedido.findMany({
      where: { userId: payload.userId },
      include: {
        produtosEmPedidos: {
          include: {
            produto: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(pedidos);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const listPedidoById = async (req: Request, res: Response) => {
  try {
    const { params } = req;
    const pedido = await prismaClient.pedido.findUnique({
      where: { id: Number(params.id) },
      include: {
        produtosEmPedidos: {
          include: { produto: true },
        },
      },
    });

    if (!pedido) {
      return res.status(404).json({ message: "Pedido não encontrado." });
    }

    res.json(pedido);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const updatePedido = async (req: Request, res: Response) => {
  try {
    const { params, body } = req;

    const bodyKeys: string[] = Object.keys(body);
    for (const key of bodyKeys) {
      if (
        key !== pedidoColumns.STATUS &&
        key !== pedidoColumns.USER_ID &&
        key !== pedidoColumns.CREATED_AT &&
        key !== pedidoColumns.UPDATED_AT
      ) {
        return res.status(400).send("Colunas não existentes");
      }
    }

    const pedido = await prismaClient.pedido.update({
      where: { id: Number(params.id) },
      data: {
        ...body,
      },
    });

    return res.status(200).json({
      message: "Pedido atualizado!",
      data: pedido,
    });
  } catch (error) {
    if ((error as PrismaClientKnownRequestError).code === "P2025") {
      return res.status(404).send("Pedido não encontrado!");
    }
    console.log(error);
    res.status(500).send(error);
  }
};

export const deletePedido = async (req: Request, res: Response) => {
  try {
    const { params } = req;

    await prismaClient.produtosEmPedidos.deleteMany({
      where: { id_pedido: Number(params.id) },
    });

    await prismaClient.pedido.delete({
      where: {
        id: Number(params.id),
      },
    });

    res.status(200).send("Pedido deletado com sucesso!");
  } catch (error) {
    if ((error as PrismaClientKnownRequestError).code === "P2025") {
      res.status(404).send("Pedido não encontrado!");
    }
    console.log(error);
    res.status(500).send(error);
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  try {
    const { params, query, body } = req;
    const { id } = params;

    const status = String((query as any).status || body.status || "");
    if (!status) {
      return res.status(400).json({ error: "status é obrigatório" });
    }

    const pedidoUpdate = await prismaClient.pedido.update({
      where: { id: Number(id) },
      data: {
        status,
      },
    });

    return res.status(200).json({
      message: "Pedido atualizado!",
      data: pedidoUpdate,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

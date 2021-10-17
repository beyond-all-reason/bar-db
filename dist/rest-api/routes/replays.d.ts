import { FastifyPluginCallback } from "fastify";
import { PluginOptions } from "~/rest-api";
declare const plugin: FastifyPluginCallback<PluginOptions>;
export default plugin;

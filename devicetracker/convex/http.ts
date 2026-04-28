import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/tracker/update",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { deviceId, latitude, longitude, speed, battery } = body;

      if (!deviceId || latitude === undefined || longitude === undefined) {
        return new Response(
          JSON.stringify({ error: "Missing required fields" }),
          { status: 400 }
        );
      }

      await ctx.runAction("tracker:receiveTrackingData", {
        deviceId,
        latitude,
        longitude,
        speed,
        battery,
      });

      return new Response(
        JSON.stringify({ success: true, message: "Location updated" })
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Internal server error" }),
        { status: 500 }
      );
    }
  }),
});

http.route({
  path: "/tracker/health",
  method: "GET",
  handler: httpAction(async () => {
    return new Response(JSON.stringify({ status: "ok" }));
  }),
});

export default http;

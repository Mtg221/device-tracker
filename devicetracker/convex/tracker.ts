import { action } from "./_generated/server";
import { v } from "convex/values";

export const receiveTrackingData = action({
  args: {
    deviceId: v.string(),
    latitude: v.number(),
    longitude: v.number(),
    speed: v.optional(v.number()),
    battery: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.runMutation("devices:updateLocation", {
      deviceId: args.deviceId,
      latitude: args.latitude,
      longitude: args.longitude,
      speed: args.speed,
      battery: args.battery,
    });
  },
});

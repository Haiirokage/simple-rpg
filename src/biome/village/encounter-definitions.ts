import type { EncounterFrame } from "../../data/encounters/types";
import { makeEncounterSkillAction, makeOutcome } from "../encounter-utils";

export type VillageEncounterFrameId =
  | "repair_job_offer"
  | "hide_and_seek_seeker"
  | "hide_and_seek_hider";

export const VILLAGE_ENCOUNTERS: Record<VillageEncounterFrameId, EncounterFrame> = {
  repair_job_offer: {
    id: "repair_job_offer",
    title: "A Fence in Need",
    description:
      "An older farmer waves you down near a stretch of broken fencing. Several posts have rotted through and the crossbeams hang at odd angles. He offers a few coins if you can help him set it right.",
    actions: [
      makeEncounterSkillAction(
        "Help with the repairs",
        { skill: ["crafting"], dc: 7 },
        {
          success: makeOutcome(
            "Working together, you manage to replace the worst posts and secure the beams. The farmer thanks you warmly and presses a few coins into your hand.",
            { resourceYield: { coin: 8 } },
          ),
          failure: makeOutcome(
            "Despite your best efforts, the repair proves trickier than expected. A beam splits when you try to nail it in place. The farmer sighs but thanks you for trying.",
          ),
        },
        { cost: { minutes: 60, energy: 5 } },
      ),
    ],
  },
  hide_and_seek_seeker: {
    id: "hide_and_seek_seeker",
    title: "Hide and Seek",
    description:
      'A group of children rush up to you, giggling. "Play with us! Play with us!". Before you can respond, they scatter in all directions to hide among the village buildings and haystacks. You\'re the seeker!',
    actions: [
      makeEncounterSkillAction(
        "Search for Timmy",
        { skill: ["hunter"], dc: 7 },
        {
          success: makeOutcome(
            "You spot muddy footprints leading behind a barrel. Timmy giggles as you find him. One down, three to go!",
            { discovery: "hide_and_seek_seeker", nextFrameId: "hide_and_seek_seeker" },
          ),
          failure: makeOutcome(
            "You search around but can't find anyone. The children get bored and reveal themselves, teasing you playfully.",
          ),
        },
        {
          cost: { minutes: 10, energy: 2 },
          discoveryRequirement: { id: "hide_and_seek_seeker", progress: 0 },
        },
      ),

      makeEncounterSkillAction(
        "Search for Sara",
        { skill: ["hunter"], dc: 10 },
        {
          success: makeOutcome(
            "A sneeze from the haystack gives Sara away. She pouts but joins Timmy on the sidelines. Two down!",
            { discovery: "hide_and_seek_seeker", nextFrameId: "hide_and_seek_seeker" },
          ),
          failure: makeOutcome(
            "Sara's hiding spot proves too clever. The children emerge, impressed by her skills.",
          ),
        },
        {
          cost: { minutes: 10, energy: 2 },
          discoveryRequirement: { id: "hide_and_seek_seeker", progress: 1 },
        },
      ),
      makeEncounterSkillAction(
        "Search for Pip",
        { skill: ["hunter"], dc: 11 },
        {
          success: makeOutcome(
            "A rustling above catches your attention. Pip grins down from a tree branch before climbing down. Just one left!",
            { discovery: "hide_and_seek_seeker", nextFrameId: "hide_and_seek_seeker" },
          ),
          failure: makeOutcome(
            "Pip remains hidden until the game ends. The little acrobat takes a bow from atop a roof.",
          ),
        },
        {
          cost: { minutes: 10, energy: 2 },
          discoveryRequirement: { id: "hide_and_seek_seeker", progress: 2 },
        },
      ),
      makeEncounterSkillAction(
        "Search for Mira",
        { skill: ["hunter"], dc: 12 },
        {
          success: makeOutcome(
            "Finally! Mira emerges from inside an empty rain barrel, applauding your skills. The children cheer and reward you with a treasure they found.",
            { resourceYield: { coin: 5 } },
          ),
          failure: makeOutcome(
            "Mira wins again! She materializes from seemingly nowhere, grinning triumphantly. Maybe next time.",
          ),
        },
        {
          cost: { minutes: 10, energy: 2 },
          discoveryRequirement: { id: "hide_and_seek_seeker", progress: 3 },
        },
      ),
    ],
  },
  hide_and_seek_hider: {
    id: "hide_and_seek_hider",
    title: "Hide and Seek",
    description:
      'A group of children rush up to you, giggling. "Play with us! Play with us!" they plead. One of them covers their eyes and starts counting. Quick, you need to hide!',
    actions: [
      makeEncounterSkillAction(
        "Stay hidden from Timmy",
        { skill: ["stealth"], dc: 6 },
        {
          success: makeOutcome(
            "You press yourself against the wall as Timmy runs past. He didn't see you! But now Sara joins the search...",
            { discovery: "hide_and_seek_hider", nextFrameId: "hide_and_seek_hider" },
          ),
          failure: makeOutcome(
            '"Found you!" Timmy shouts triumphantly, pointing at your hiding spot. The children laugh and thank you for playing.',
          ),
        },
        {
          cost: { minutes: 5, energy: 1 },
          discoveryRequirement: { id: "hide_and_seek_hider", progress: 0 },
        },
      ),
      makeEncounterSkillAction(
        "Evade Timmy and Sara",
        { skill: ["stealth"], dc: 8 },
        {
          success: makeOutcome(
            "You slip behind a barrel just as Sara peeks around the corner. Two down, two to go. Pip joins the hunt...",
            { discovery: "hide_and_seek_hider", nextFrameId: "hide_and_seek_hider" },
          ),
          failure: makeOutcome(
            'Sara spots you through a gap in the fence. "Over here!" she calls. The children applaud your effort.',
          ),
        },
        {
          cost: { minutes: 5, energy: 1 },
          discoveryRequirement: { id: "hide_and_seek_hider", progress: 1 },
        },
      ),
      makeEncounterSkillAction(
        "Outsmart three seekers",
        { skill: ["stealth"], dc: 10 },
        {
          success: makeOutcome(
            "You hold your breath as Pip climbs overhead, scanning the area. He moves on. Just Mira left...",
            { discovery: "hide_and_seek_hider", nextFrameId: "hide_and_seek_hider" },
          ),
          failure: makeOutcome(
            'Pip drops down from above, grinning. "Gotcha!" The acrobat always finds everyone eventually.',
          ),
        },
        {
          cost: { minutes: 5, energy: 1 },
          discoveryRequirement: { id: "hide_and_seek_hider", progress: 2 },
        },
      ),
      makeEncounterSkillAction(
        "Evade the whole group",
        { skill: ["stealth"], dc: 11 },
        {
          success: makeOutcome(
            'All four children search desperately but you\'ve found the perfect spot. When you finally emerge, they stare in awe. "Nobody beats Mira!" she exclaims, impressed. They reward your legendary hiding skills.',
            { resourceYield: { coin: 8 } },
          ),
          failure: makeOutcome(
            'Mira somehow appears right beside you, tapping your shoulder with a smirk. "Nice try!" The children cheer for their champion.',
          ),
        },
        {
          cost: { minutes: 5, energy: 1 },
          discoveryRequirement: { id: "hide_and_seek_hider", progress: 3 },
        },
      ),
    ],
  },
};

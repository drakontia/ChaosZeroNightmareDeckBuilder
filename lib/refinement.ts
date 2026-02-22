import { Refinement } from "@/types";

// Unified God Hirameki effects list with applicable gods per effect
export const REFINEMENT_EFFECTS: Refinement[] = [
  { id: "refinement_01", description: "カード保存、消滅時、ランダムな敵意固定ダメージ100%(各ターン1回)"},
  { id: "refinement_02", description: "シールドを所持した状態でターン狩猟時、敵全体に固定ダメージ100%"},
  { id: "refinement_03", description: "ターン開始時、30%の確率で、消滅カードをドロー1"},
  { id: "refinement_04", description: "戦闘開始時、自分の消滅カードをドロー1"},
  { id: "refinement_05", description: "消滅カードを能力でドロー時、即座に発動(各ターン1回)"},
  { id: "refinement_06", description: "攻撃カードのダメージ量20%増加"},
  { id: "refinement_07", description: "シールド獲得量と治癒量15%増加"},
  { id: "refinement_08", description: "ダメージを完全に防ぐと、次のターン開始時、1ターンの間、味方のダメージ量10%増加(各ターン1回)"},
  { id: "refinement_09", description: "戦闘開始時、所持中のカードが33枚以上の場合、攻撃カードのダメージ量30%増加"},
  { id: "refinement_10", description: "戦闘開始時、所持中のカードが18枚以上の場合、攻撃カードのダメージ量30%増加"},
  { id: "refinement_11", description: "消滅カードのダメージ量25%増加"},
  { id: "refinement_12", description: "コスト2以上の攻撃カードのダメージ量25%増加"},
  { id: "refinement_13", description: "戦闘開始時、保存1"},
  { id: "refinement_14", description: "脆弱状態の敵に攻撃カード発動時、会心率+15%"},
  { id: "refinement_15", description: "1ターンの間、ダメージを与えなかった場合、次のターン開始時、1ターンの間、ダメージ量50%増加"},
  { id: "refinement_16", description: "ターン開始時、手札の味方消滅カード数に応じて、ランダムな敵に固定ダメージ60%"},
  { id: "refinement_17", description: "反撃時、敵全体に固定ダメージ100%(各ターン1回)"},
  { id: "refinement_18", description: "シールド獲得時、固定シールド100%(各ターン1回)"},
  { id: "refinement_19", description: "コスト3以上のカード発動時、アクションポイント1(各ターン1回)"},
  { id: "refinement_20", description: "アクションポイント1以上を所持した状態でターン終了時、敵全体に脆弱1"}
];

import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Brand, BottomTabInset, MaxContentWidth, Spacing, WebHeaderInset } from "@/constants/theme";
import { useAlbumIndex, type AlbumSummary } from "@/hooks/use-album-index";
import { useTeamSquad } from "@/hooks/use-team-squad";
import { StickerCard } from "@/components/sticker/sticker-card";
import { PackOpening } from "@/components/sticker/pack-opening";

/**
 * Álbum — the collection home. An index of every album you can fill (the
 * showcase match plus each national team's squad), each with its completion;
 * tap one to open its card grid. Golazos live on the Golazos tab. See ticket
 * VIT-6 / deploy polish.
 */
export default function AlbumScreen() {
  const { albums, unopenedPackIds, loading, refresh } = useAlbumIndex();
  const [openingPackId, setOpeningPackId] = useState<string | null>(null);
  const [selected, setSelected] = useState<AlbumSummary | null>(null);

  if (selected) {
    return (
      <AlbumDetail
        album={selected}
        onBack={() => {
          setSelected(null);
          refresh();
        }}
      />
    );
  }

  const fillable = albums.filter((a) => a.total > 0);
  const completed = fillable.filter((a) => a.owned >= a.total && a.total > 0).length;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.headerRow}>
            <ThemedText type="subtitle" style={styles.heading}>
              Álbumes
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {completed}/{fillable.length} completos
            </ThemedText>
          </View>
          <ThemedText type="small" themeColor="textSecondary">
            Elegí un álbum para verlo — las figuritas se ganan abriendo sobres.
          </ThemedText>

          {unopenedPackIds.length > 0 ? (
            <Pressable style={styles.packBtn} onPress={() => setOpeningPackId(unopenedPackIds[0]!)}>
              <ThemedText type="small" style={styles.packText}>
                🎁 Abrir sobre · {unopenedPackIds.length} en espera
              </ThemedText>
            </Pressable>
          ) : (
            <ThemedView type="backgroundElement" style={styles.hint}>
              <ThemedText type="small" themeColor="textSecondary">
                No tenés sobres — ganá trivia de jugadas para conseguirlos.
              </ThemedText>
            </ThemedView>
          )}

          {loading ? (
            <ThemedText type="small" themeColor="textSecondary">
              Cargando álbumes…
            </ThemedText>
          ) : (
            <View style={styles.grid}>
              {albums.map((a) => (
                <AlbumTile key={a.key} album={a} onPress={() => setSelected(a)} />
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      {openingPackId ? (
        <PackOpening
          packId={openingPackId}
          onDone={() => {
            setOpeningPackId(null);
            refresh();
          }}
        />
      ) : null}
    </ThemedView>
  );
}

/** A single album entry on the index: flag, name, and completion. */
function AlbumTile({ album, onPress }: { album: AlbumSummary; onPress: () => void }) {
  const pct = album.total > 0 ? Math.round((album.owned / album.total) * 100) : 0;
  const done = album.total > 0 && album.owned >= album.total;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedView type="backgroundElement" style={styles.tile}>
        <View style={styles.tileTop}>
          <ThemedText style={styles.tileFlag}>{album.flag}</ThemedText>
          {done ? <ThemedText style={styles.tileCheck}>✓</ThemedText> : null}
        </View>
        <ThemedText type="smallBold" numberOfLines={1} style={styles.tileName}>
          {album.title}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {album.owned}/{album.total} · {pct}%
        </ThemedText>
        <View style={styles.tileTrack}>
          <View style={[styles.tileFill, { width: `${pct}%` }]} />
        </View>
      </ThemedView>
    </Pressable>
  );
}

/** Opens the selected country album. */
function AlbumDetail({ album, onBack }: { album: AlbumSummary; onBack: () => void }) {
  return <TeamAlbum teamCode={album.teamCode} title={album.title} flag={album.flag} onBack={onBack} />;
}

function TeamAlbum({
  teamCode,
  title,
  flag,
  onBack,
}: {
  teamCode: string;
  title: string;
  flag: string;
  onBack: () => void;
}) {
  const { players, loading } = useTeamSquad(teamCode);
  const items = players.map((p) => ({ id: p.id, card: p.card, owned: p.owned, count: p.count }));
  return <AlbumGrid title={title} flag={flag} items={items} loading={loading} onBack={onBack} />;
}

interface GridItem {
  id: string;
  card: import("@vitness/shared").StickerCard;
  owned: boolean;
  count: number;
}

/** Shared album detail layout: back · title · completion · card grid. */
function AlbumGrid({
  title,
  flag,
  items,
  loading,
  onBack,
}: {
  title: string;
  flag: string;
  items: GridItem[];
  loading: boolean;
  onBack: () => void;
}) {
  const owned = items.filter((i) => i.owned).length;
  const total = items.length;
  const pct = total > 0 ? Math.round((owned / total) * 100) : 0;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <Pressable onPress={onBack} hitSlop={Spacing.two} style={({ pressed }) => pressed && styles.pressed}>
            <ThemedText type="link">‹ Álbumes</ThemedText>
          </Pressable>

          <View style={styles.headerRow}>
            <ThemedText type="subtitle" style={styles.heading}>
              {flag} {title}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {owned}/{total} · {pct}%
            </ThemedText>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${pct}%` }]} />
          </View>

          {loading ? (
            <ThemedText type="small" themeColor="textSecondary">
              Cargando álbum…
            </ThemedText>
          ) : total === 0 ? (
            <ThemedView type="backgroundElement" style={styles.hint}>
              <ThemedText type="small" themeColor="textSecondary">
                Las figuritas de {title} llegan pronto.
              </ThemedText>
            </ThemedView>
          ) : (
            <View style={styles.grid}>
              {items.map((s) => (
                <StickerCard key={s.id} card={s.owned ? s.card : null} count={s.count} />
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const TILE_W = 110;

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, width: "100%", maxWidth: MaxContentWidth, alignSelf: "center" },
  content: {
    padding: Spacing.three,
    paddingTop: Spacing.four + WebHeaderInset,
    paddingBottom: BottomTabInset + Spacing.four,
    gap: Spacing.two,
  },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  heading: { fontSize: 28, lineHeight: 34 },
  pressed: { opacity: 0.7 },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#212225",
    overflow: "hidden",
    marginVertical: Spacing.one,
  },
  progressFill: { height: "100%", backgroundColor: Brand.accent },
  packBtn: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    backgroundColor: "#185FA5",
    borderRadius: 999,
    marginVertical: Spacing.one,
  },
  packText: { color: "#ffffff" },
  hint: { borderRadius: Spacing.two, padding: Spacing.three, marginVertical: Spacing.one },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two, justifyContent: "flex-start" },
  // album index tiles
  tile: {
    width: TILE_W,
    borderRadius: Spacing.three,
    padding: Spacing.two,
    gap: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.06)",
  },
  tileTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  tileFlag: { fontSize: 34, lineHeight: 40 },
  tileCheck: { color: Brand.accent, fontSize: 16, fontWeight: "900" },
  tileName: { color: "#ffffff", fontSize: 13 },
  tileTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "#2a2d31",
    overflow: "hidden",
    marginTop: 2,
  },
  tileFill: { height: "100%", backgroundColor: Brand.accent },
});

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 60,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 48,
    paddingBottom: 24,
    borderBottom: "1.5px solid #e5e7eb",
  },
  brand: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 3,
    color: "#111827",
  },
  brandSub: {
    fontSize: 7,
    color: "#9ca3af",
    letterSpacing: 2,
    marginTop: 3,
  },
  seal: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
  },
  sealText: {
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
  },
  certLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 4,
    color: "#6b7280",
    textTransform: "uppercase",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    marginBottom: 8,
    lineHeight: 1.2,
  },
  tagline: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 40,
    lineHeight: 1.5,
  },
  divider: {
    height: 1,
    backgroundColor: "#f3f4f6",
    marginBottom: 32,
  },
  bodyText: {
    fontSize: 11,
    color: "#374151",
    lineHeight: 1.8,
    marginBottom: 32,
  },
  grid: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 32,
  },
  card: {
    flex: 1,
    backgroundColor: "#f9fafb",
    borderRadius: 6,
    padding: 16,
    border: "1px solid #e5e7eb",
  },
  cardLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 2,
    color: "#9ca3af",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  cardValue: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },
  cardValueMono: {
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#374151",
  },
  footer: {
    marginTop: 48,
    paddingTop: 20,
    borderTop: "1px solid #e5e7eb",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  footerNote: {
    fontSize: 8,
    color: "#9ca3af",
    lineHeight: 1.5,
    maxWidth: 360,
  },
  footerBrand: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#d1d5db",
    letterSpacing: 2,
  },
});

type Props = {
  project: {
    id: string;
    title: string;
    tagline: string | null;
    description: string | null;
    created_at: string | null;
    profiles: { full_name: string | null; username: string } | null;
  };
};

export function CertificatePDF({ project }: Props) {
  const founderName =
    project.profiles?.full_name ?? project.profiles?.username ?? "Unknown";

  const createdAt = project.created_at ? new Date(project.created_at) : new Date();
  const dateFormatted = createdAt.toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeFormatted = createdAt.toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "UTC",
  });

  return (
    <Document
      title={`Certificato di Deposito — ${project.title}`}
      author="Ensombly"
      subject="Certificato di Deposito dell'Idea"
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>ENSOMBLY</Text>
            <Text style={styles.brandSub}>NETWORK PER PROGETTI STARTUP</Text>
          </View>
          <View style={styles.seal}>
            <Text style={styles.sealText}>✦</Text>
          </View>
        </View>

        {/* Certificate label + project title */}
        <Text style={styles.certLabel}>Certificato di Deposito dell'Idea</Text>
        <Text style={styles.title}>{project.title}</Text>
        {project.tagline && (
          <Text style={styles.tagline}>{project.tagline}</Text>
        )}

        <View style={styles.divider} />

        {/* Body */}
        <Text style={styles.bodyText}>
          Il presente documento certifica che {founderName} ha depositato
          l'idea del progetto "{project.title}" sulla piattaforma Ensombly
          in data {dateFormatted} alle ore {timeFormatted} UTC.{"\n\n"}
          Il deposito costituisce traccia temporale verificabile della
          pubblicazione dell'idea e può essere utilizzato come riferimento
          per stabilire la priorità temporale della stessa.
        </Text>

        {/* Info grid */}
        <View style={styles.grid}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Founder</Text>
            <Text style={styles.cardValue}>{founderName}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Data di deposito</Text>
            <Text style={styles.cardValue}>{dateFormatted}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Ora (UTC)</Text>
            <Text style={styles.cardValue}>{timeFormatted}</Text>
          </View>
        </View>

        {/* Reference */}
        <View style={{ ...styles.card, marginBottom: 0 }}>
          <Text style={styles.cardLabel}>Numero di riferimento</Text>
          <Text style={styles.cardValueMono}>{project.id}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerNote}>
            Questo certificato è generato automaticamente da Ensombly e non
            costituisce protezione legale della proprietà intellettuale. Non
            sostituisce brevetti, marchi o altri strumenti di tutela legale.
            Serve esclusivamente come prova di anteriorità temporale.
          </Text>
          <Text style={styles.footerBrand}>ENSOMBLY</Text>
        </View>
      </Page>
    </Document>
  );
}

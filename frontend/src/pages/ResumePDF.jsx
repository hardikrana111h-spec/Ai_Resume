import React from "react";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

Font.register({
  family: "Helvetica",
});

const styles = StyleSheet.create({
  page: {
    paddingTop: 18,
    paddingBottom: 18,
    paddingHorizontal: 20,
    fontFamily: "Helvetica",
    fontSize: 8.8,
    color: "#000000",
    backgroundColor: "#ffffff",
    lineHeight: 1.22,
  },

  header: {
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
    borderBottomStyle: "solid",
  },
  name: {
    fontSize: 18,
    fontWeight: 700,
    color: "#000000",
  },
  title: {
    fontSize: 10.5,
    color: "#000000",
    marginTop: 1,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
  },
  contactText: {
    fontSize: 8,
    color: "#000000",
    marginRight: 8,
    marginBottom: 2,
  },

  summaryBlock: {
    marginBottom: 8,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 9.8,
    fontWeight: 700,
    color: "#000000",
    marginBottom: 4,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
    borderBottomStyle: "solid",
  },
  summary: {
    fontSize: 8.4,
    color: "#000000",
  },

  twoCol: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  leftCol: {
    width: "64%",
    paddingRight: 8,
  },
  rightCol: {
    width: "36%",
    paddingLeft: 5,
  },

  item: {
    marginBottom: 6,
    padding: 6,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 7,
    backgroundColor: "#ffffff",
  },
  itemHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
    marginBottom: 2,
  },
  itemLeft: {
    flex: 1,
    paddingRight: 5,
  },
  itemTitle: {
    fontSize: 9,
    fontWeight: 700,
    color: "#000000",
    marginBottom: 1,
  },
  itemSub: {
    fontSize: 8,
    color: "#000000",
  },
  itemMeta: {
    width: 82,
    fontSize: 7.6,
    color: "#000000",
    textAlign: "right",
  },

  bulletRow: {
    flexDirection: "row",
    marginBottom: 1.5,
  },
  bulletDot: {
    width: 8,
    fontSize: 9,
    color: "#000000",
    lineHeight: 1.1,
  },
  bulletText: {
    flex: 1,
    fontSize: 8.2,
    color: "#000000",
  },

  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 1,
  },
  chip: {
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 999,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    fontSize: 7.8,
    color: "#000000",
    marginRight: 5,
    marginBottom: 5,
  },

  linkText: {
    fontSize: 8,
    color: "#000000",
    marginBottom: 3,
  },
  muted: {
    color: "#000000",
    fontSize: 8,
  },
});

const splitLines = (text = "") =>
  String(text)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const renderBullets = (points = []) =>
  points.map((point, index) => (
    <View style={styles.bulletRow} key={`${point}-${index}`}>
      <Text style={styles.bulletDot}>•</Text>
      <Text style={styles.bulletText}>{point}</Text>
    </View>
  ));

function ResumePDF({ data }) {
  const {
    form,
    skills = [],
    experiences = [],
    educations = [],
    projectsText = "",
    templateLayout = "classic",
  } = data || {};

  const projects = splitLines(projectsText);

  const Header = () => (
    <View style={styles.header}>
      <Text style={styles.name}>{form?.fullName || "Your Name"}</Text>
      <Text style={styles.title}>{form?.title || "Professional Title"}</Text>

      <View style={styles.contactRow}>
        {form?.email ? <Text style={styles.contactText}>{form.email}</Text> : null}
        {form?.phone ? <Text style={styles.contactText}>{form.phone}</Text> : null}
        {form?.location ? <Text style={styles.contactText}>{form.location}</Text> : null}
      </View>
    </View>
  );

  const Summary = () => (
    <View style={styles.summaryBlock}>
      <Text style={styles.sectionTitle}>Summary</Text>
      <Text style={styles.summary}>{form?.summary || "Write a short professional summary here."}</Text>
    </View>
  );

  const Experience = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Experience</Text>
      {experiences.length > 0 ? (
        experiences.map((exp, index) => (
          <View style={styles.item} key={exp.id || index}>
            <View style={styles.itemHead}>
              <View style={styles.itemLeft}>
                <Text style={styles.itemTitle}>{exp.title || "Role Title"}</Text>
                <Text style={styles.itemSub}>{exp.company || "Company / Internship"}</Text>
              </View>
              <Text style={styles.itemMeta}>
                {[exp.period, exp.location].filter(Boolean).join(" | ")}
              </Text>
            </View>

            {exp.points?.length > 0 ? renderBullets(exp.points) : null}
          </View>
        ))
      ) : (
        <Text style={styles.muted}>No experience added.</Text>
      )}
    </View>
  );

  const Projects = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Projects</Text>
      {projects.length > 0 ? (
        projects.map((project, index) => (
          <View style={styles.bulletRow} key={`${project}-${index}`}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>{project}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.muted}>No projects added.</Text>
      )}
    </View>
  );

  const Skills = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Skills</Text>
      {skills.length > 0 ? (
        <View style={styles.chipWrap}>
          {skills.map((skill, index) => (
            <Text style={styles.chip} key={`${skill}-${index}`}>
              {skill}
            </Text>
          ))}
        </View>
      ) : (
        <Text style={styles.muted}>No skills added.</Text>
      )}
    </View>
  );

  const Education = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Education</Text>
      {educations.length > 0 ? (
        educations.map((edu, index) => (
          <View style={styles.item} key={edu.id || index}>
            <View style={styles.itemHead}>
              <View style={styles.itemLeft}>
                <Text style={styles.itemTitle}>{edu.degree || "Degree"}</Text>
                <Text style={styles.itemSub}>{edu.institution || "Institution"}</Text>
              </View>
              <Text style={styles.itemMeta}>
                {[edu.period, edu.location, edu.score].filter(Boolean).join(" | ")}
              </Text>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.muted}>No education added.</Text>
      )}
    </View>
  );

  const Links = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Links</Text>
      {form?.linkedin ? <Text style={styles.linkText}>{form.linkedin}</Text> : null}
      {form?.github ? <Text style={styles.linkText}>{form.github}</Text> : null}
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Header />
        <Summary />

        {templateLayout === "sidebar" ? (
          <View style={styles.twoCol}>
            <View style={styles.leftCol}>
              <Experience />
              <Projects />
            </View>
            <View style={styles.rightCol}>
              <Skills />
              <Education />
              <Links />
            </View>
          </View>
        ) : templateLayout === "academic" ? (
          <View style={styles.twoCol}>
            <View style={styles.leftCol}>
              <Education />
              <Experience />
            </View>
            <View style={styles.rightCol}>
              <Skills />
              <Projects />
              <Links />
            </View>
          </View>
        ) : (
          <View style={styles.twoCol}>
            <View style={styles.leftCol}>
              <Experience />
              <Projects />
            </View>
            <View style={styles.rightCol}>
              <Skills />
              <Education />
              <Links />
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}

export default ResumePDF;
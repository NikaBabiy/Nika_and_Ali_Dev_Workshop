import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ali_milstones from './ali_mistones';
import Project2 from './Project2';
import Project3 from './Project3';

export default function Index() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ali_milstones" element={<ali_milstones />} />
        <Route path="/project2" element={<Project2 />} />
        <Route path="/project3" element={<Project3 />} />
      </Routes>
    </Router>
  );
}

function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Choose which project you want to see</Text>
      <View style={styles.buttonRow}>
        <Link to="ali_milstones" style={styles.button}>
          <Text style={styles.buttonText}>ali_milstones</Text>
        </Link>
        <Link to="/project2" style={styles.button}>
          <Text style={styles.buttonText}>Project 2</Text>
        </Link>
      </View>
      <Link to="/project3" style={styles.bigButton}>
        <Text style={styles.buttonText}>Project 3</Text>
      </Link>
    </View>
  );
}
const fs = require('fs').promises;
const path = require('path');

class JsonStorage {
    constructor() {
        this.dataDir = path.join(__dirname, '..', 'data');
        this.usersFile = path.join(this.dataDir, 'users.json');
        this.internshipsFile = path.join(this.dataDir, 'internships.json');
    }

    // Generic file operations
    async readFile(filePath) {
        try {
            const data = await fs.readFile(filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                return [];
            }
            throw error;
        }
    }

    async writeFile(filePath, data) {
        try {
            await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
        } catch (error) {
            throw error;
        }
    }

    // User operations
    async getUsers() {
        return await this.readFile(this.usersFile);
    }

    async saveUsers(users) {
        return await this.writeFile(this.usersFile, users);
    }

    async findUser(query) {
        const users = await this.getUsers();
        return users.find(user => {
            return Object.keys(query).every(key => user[key] === query[key]);
        });
    }

    async createUser(userData) {
        const users = await this.getUsers();
        const newUser = {
            _id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            ...userData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        users.push(newUser);
        await this.saveUsers(users);
        return newUser;
    }

    async updateUser(id, updateData) {
        const users = await this.getUsers();
        const userIndex = users.findIndex(user => user._id === id);
        
        if (userIndex === -1) {
            throw new Error('User not found');
        }

        users[userIndex] = {
            ...users[userIndex],
            ...updateData,
            updatedAt: new Date().toISOString()
        };

        await this.saveUsers(users);
        return users[userIndex];
    }

    // Internship operations
    async getInternships() {
        return await this.readFile(this.internshipsFile);
    }

    async saveInternships(internships) {
        return await this.writeFile(this.internshipsFile, internships);
    }

    async getActiveInternships() {
        const internships = await this.getInternships();
        return internships
            .filter(internship => internship.isActive)
            .sort((a, b) => a.sortOrder - b.sortOrder);
    }

    async searchInternships(searchTerm) {
        const internships = await this.getActiveInternships();
        const searchRegex = new RegExp(searchTerm, 'i');
        
        return internships.filter(internship => {
            return searchRegex.test(internship.mentorName) ||
                   searchRegex.test(internship.profession) ||
                   searchRegex.test(internship.specialization) ||
                   searchRegex.test(internship.city) ||
                   internship.includes.some(item => searchRegex.test(item)) ||
                   internship.programs.some(program => 
                       searchRegex.test(program.title) || 
                       searchRegex.test(program.duration)
                   );
        });
    }

    async createInternship(internshipData) {
        const internships = await this.getInternships();
        const newInternship = {
            _id: 'internship_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            ...internshipData,
            programs: internshipData.programs.map(program => ({
                _id: 'program_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                ...program
            })),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        internships.push(newInternship);
        await this.saveInternships(internships);
        return newInternship;
    }

    async updateInternship(id, updateData) {
        const internships = await this.getInternships();
        const internshipIndex = internships.findIndex(internship => internship._id === id);
        
        if (internshipIndex === -1) {
            throw new Error('Internship not found');
        }

        // Update programs with IDs if they don't have them
        if (updateData.programs) {
            updateData.programs = updateData.programs.map(program => ({
                _id: program._id || 'program_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                ...program
            }));
        }

        internships[internshipIndex] = {
            ...internships[internshipIndex],
            ...updateData,
            updatedAt: new Date().toISOString()
        };

        await this.saveInternships(internships);
        return internships[internshipIndex];
    }

    async deleteInternship(id) {
        const internships = await this.getInternships();
        const internshipIndex = internships.findIndex(internship => internship._id === id);
        
        if (internshipIndex === -1) {
            throw new Error('Internship not found');
        }

        const deletedInternship = internships.splice(internshipIndex, 1)[0];
        await this.saveInternships(internships);
        return deletedInternship;
    }

    async findInternshipById(id) {
        const internships = await this.getInternships();
        return internships.find(internship => internship._id === id);
    }

    async toggleInternshipStatus(id) {
        const internship = await this.findInternshipById(id);
        if (!internship) {
            throw new Error('Internship not found');
        }

        return await this.updateInternship(id, { 
            isActive: !internship.isActive 
        });
    }

    // Statistics
    async getStats() {
        const internships = await this.getInternships();
        const activeInternships = internships.filter(i => i.isActive);
        const mentors = new Set(internships.map(i => i.mentorName));
        const cities = new Set(internships.map(i => i.city));

        return {
            totalInternships: internships.length,
            activeInternships: activeInternships.length,
            totalMentors: mentors.size,
            totalCities: cities.size
        };
    }
}

module.exports = new JsonStorage();

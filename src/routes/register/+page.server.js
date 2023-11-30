// Import necessary modules
import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Import your Prisma client
import { prisma } from '../../lib/server/prisma';

// Define user roles
const Roles = {
	ADMIN: 'ADMIN',
	USER: 'USER'
};

// Create a function to send a confirmation email
const sendConfirmationEmail = async (email, verificationToken) => {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'adil2mae@gmail.com', // Replace with your email
			pass: 'btxo htzr gqdw dryy ' // Replace with your email password
		}
	});

	const confirmationLink = `localhost:5173/confirm/${verificationToken}`;

	const mailOptions = {
		from: 'adil2mae@gmail.com',
		to: email,
		subject: 'Word Alchemy Account Confirmation',
		text: `Please click the following link to confirm your email: ${confirmationLink}`
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		console.log('Email sent ->', info.response);
	} catch (error) {
		console.error('Error sending email ->', error);
		// Handle email sending error if needed
	}
};

export const actions = {
	register: async ({ request }) => {
		const data = await request.formData();
		const username = data.get('username'); // Assuming 'username' is the email
		const password = data.get('password');

		console.log('typeof username -->', typeof username);
		console.log('typeof password -->', typeof password);

		if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
			return fail(400, { invalidFormat: true });
		}

		const user = await prisma.user.findUnique({
			where: { username }
		});

		if (user) {
			return fail(400, { usernameTaken: true });
		}

		const verificationToken = crypto.randomBytes(16).toString('hex');

		const newUser = await prisma.user.create({
			data: {
				username,
				password: await bcrypt.hash(password, 10),
				session: crypto.randomUUID(),
				role: { connect: { name: Roles.USER } },

				verificationToken
			}
		});

		// Send a confirmation email to the user
		await sendConfirmationEmail(username, verificationToken);

		throw redirect(303, '/');
	}
};
